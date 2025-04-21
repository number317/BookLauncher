package com.booklauncher.module;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.FileObserver;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;
import com.booklauncher.dto.Book;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.shockwave.pdfium.PdfDocument;
import com.shockwave.pdfium.PdfiumCore;

import java.io.*;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public class BookManager extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private FileObserver fileObserver;

    private Boolean isPackageInstalled = false;

    public BookManager(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;

        File booksDir = new File(Environment.getExternalStorageDirectory(), "Books");
        if (!booksDir.exists() || !booksDir.isDirectory()) {
            booksDir.mkdir();
        }

        File cacheDir = new File(booksDir, ".cache");
        if (!cacheDir.exists()) {
            cacheDir.mkdirs();
        }

        this.isPackageInstalled = isPackageInstalled("org.koreader.launcher");
    }

    @NonNull
    @Override
    public String getName() {
        return "_BookManager";
    }

    private String getEventName(int event) {
        switch (event) {
            case FileObserver.MOVED_TO:
            case FileObserver.CLOSE_WRITE:
                return "CREATE";
            case FileObserver.DELETE:
            case FileObserver.MOVED_FROM:
                return "DELETE";
            default:
                return "UNKNOWN";
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void initWatch() {
        File booksDir = new File(Environment.getExternalStorageDirectory(), "Books");
        Log.i("BookManager", "watch path " + booksDir.getAbsolutePath());
        fileObserver = new FileObserver(booksDir.getAbsolutePath(), FileObserver.DELETE | FileObserver.MOVED_FROM | FileObserver.MOVED_TO | FileObserver.CLOSE_WRITE) {
            @Override
            public void onEvent(int event, String filename) {
                boolean isPdf = filename.endsWith(".pdf");
                boolean isEpub = filename.endsWith(".epub");
                if (filename != null && (isPdf || isEpub)) {
                    Log.i("BookManager", "event " + getEventName(event) + " " + filename);

                    WritableMap params = Arguments.createMap();

                    params.putString("event", getEventName(event));
                    String coverPath = booksDir.getAbsolutePath() + "/.cache/" + filename.replace(isPdf ? ".pdf" : ".epub", ".jpg");
                    File cover = new File(coverPath);

                    Book book = new Book(
                            filename,
                            booksDir.getAbsolutePath() + "/" + filename,
                            isPdf ? "pdf" : "epub",
                            coverPath,
                            cover.exists()
                    );

                    params.putMap("book", book.toWritableMap());
                    sendEvent("BookChanged", params);

                    if (event == FileObserver.DELETE || event == FileObserver.MOVED_FROM) {
                        Log.d("BookManager", "del cache cover " + coverPath);
                        try {
                            cover.delete();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    if (!cover.exists() && (event == FileObserver.CLOSE_WRITE || event == FileObserver.MOVED_TO)) {
                        new Thread(() -> {
                            try {
                                if (isPdf) {
                                    extractPdfCover(book, cover);
                                } else {
                                    extractEpubCover(book, cover);
                                }
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                        }).start();
                    }
                }
            }
        };
    }

    @ReactMethod
    public void startWatch(Promise promise) {
        try {
            fileObserver.startWatching();
            promise.resolve("File observer started");
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopWatch(Promise promise) {
        try {
            if (fileObserver != null) {
                fileObserver.stopWatching();
                fileObserver = null;
                promise.resolve("File observer stopped");
            } else {
                promise.resolve("File observer not started");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getBookList(Promise promise) {
        try {
            File booksDir = new File(Environment.getExternalStorageDirectory(), "Books");
            WritableArray bookList = Arguments.createArray();
            File[] files = booksDir.listFiles();
            if (files != null) {
                for (File file : files) {
                    Log.i("BookManager", "find file " + file.getName());

                    Boolean isPdf = file.getName().endsWith(".pdf");
                    String coverPath = booksDir.getAbsolutePath() + "/.cache/" + file.getName().replace(isPdf ? ".pdf" : ".epub", ".jpg");
                    File cover = new File(coverPath);
                    if (file.isFile() && (file.getName().endsWith(".pdf")) || (file.getName().endsWith(".epub"))) {
                        Book book = new Book(
                                file.getName(),
                                file.getAbsolutePath(),
                                isPdf ? "pdf" : "epub",
                                coverPath,
                                cover.exists()
                        );
                        if (book.getType() == "pdf") {
                            if (!cover.exists()) {
                                new Thread(() -> {
                                    try {
                                        extractPdfCover(book, cover);
                                    } catch (Exception e) {
                                        throw new RuntimeException(e);
                                    }
                                }).start();
                            }
                        } else {
                            if (!cover.exists()) {
                                new Thread(() -> {
                                    try {
                                        extractEpubCover(book, cover);
                                    } catch (Exception e) {
                                        throw new RuntimeException(e);
                                    }
                                }).start();
                            }
                        }
                        bookList.pushMap(book.toWritableMap());
                    }
                }
            }
            promise.resolve(bookList);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteBook(String filePath, Promise promise) {
        try {
            File file = new File(filePath);
            boolean isPdf = file.getName().endsWith(".pdf");
            String coverPath = file.getParentFile().getAbsolutePath() + "/.cache/" + file.getName().replace(isPdf ? ".pdf" : ".epub", ".jpg");
            File cache = new File(coverPath);
            if (file.exists()) {
                file.delete();
                if (cache.exists()) {
                    cache.delete();
                }
                promise.resolve("File deleted");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void openBook(String filePath, Promise promise) {
        // check is package installed
        if (!this.isPackageInstalled) {
            promise.reject("NoKoreader");
            return;
        }
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                Uri uri = getContentUri(filePath);
                Log.d("BookManager", "openBook uri " + uri);
                if (uri != null) {
                    intent.setDataAndType(uri, filePath.endsWith(".pdf") ? "application/pdf" : "application/epub+zip");
                } else {
                    Toast.makeText(reactContext, "File not found", Toast.LENGTH_SHORT).show();
                    return;
                }
            } else {
                intent.setDataAndType(Uri.parse("file://" + filePath), filePath.endsWith(".pdf") ? "application/pdf" : "application/epub+zip");
            }
            intent.setPackage("org.koreader.launcher");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve("open success");
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    private boolean isPackageInstalled(String packageName) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    private Uri getContentUri (String filePath) {
        try {
            Uri contentUri = FileProvider.getUriForFile(reactContext,
                    reactContext.getPackageName() + ".fileProvider",
                    new File(filePath));
            return contentUri;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void extractEpubCover(Book book, File cover) throws Exception {
        String filePath = book.getPath();

        ZipFile epubFile = null;
        try {
            epubFile = new ZipFile(filePath);
            ZipEntry opfEntry = null;
            ZipEntry coverEntry = null;

            Enumeration<? extends ZipEntry> entries = epubFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                if (entry.getName().endsWith(".opf")) {
                    opfEntry = entry;
                    break;
                }
            }

            if (opfEntry != null) {
                InputStream opfInputStream = epubFile.getInputStream(opfEntry);
                String relativeCoverPath = parseOpfForCoverPath(opfInputStream);

                if (relativeCoverPath != null) {
                    String opfPath = opfEntry.getName();
                    String baseDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
                    String fullPath = baseDir + relativeCoverPath;

                    coverEntry = epubFile.getEntry(URLDecoder.decode(fullPath));

                    if (coverEntry != null) {
                        // 保存cover为缓存图片
                        InputStream coverInputStream = epubFile.getInputStream(coverEntry);

                        try (FileOutputStream fileOutputStream = new FileOutputStream(cover)) {
                            byte[] buffer = new byte[1024];
                            int length;
                            while ((length = coverInputStream.read(buffer)) > 0) {
                                fileOutputStream.write(buffer, 0, length);
                            }

                            // 通知更新封面
                            WritableMap params = Arguments.createMap();
                            params.putString("event", "COVER-READY");
                            params.putMap("book", book.toWritableMap());
                            Log.d("BookManager", "update cover event");
                            sendEvent("BookChanged", params);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        } finally {
            if (epubFile != null) {
                epubFile.close();
            }
        }
    }

    private String parseOpfForCoverPath(InputStream opfInputStream) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(opfInputStream));
        String line;
        String coverId = "cover";
        String coverPath = null;

        while ((line = reader.readLine()) != null) {
            if (line.contains("name=\"cover\"")) {
                int contentIndex = line.indexOf("content=\"");
                if (contentIndex != -1) {
                    coverId = line.substring(contentIndex + 9, line.indexOf("\"", contentIndex + 9));
                }
            }

            if (coverId != null && line.contains("<item") && line.contains("id=\"" + coverId + "\"")) {
                int hrefIndex = line.indexOf("href=\"");
                if (hrefIndex != -1) {
                    coverPath = line.substring(hrefIndex + 6, line.indexOf("\"", hrefIndex + 6));
                    break;
                }
            }
        }

        reader.close();
        return coverPath != null ? coverPath : null;
    }

    private void extractPdfCover(Book book, File cover) throws Exception {
        Log.d("extractPdfCover", "extractPdfCover");
        String filePath = book.getPath();

        PdfiumCore pdfiumCore = new PdfiumCore(reactContext);
        PdfDocument pdfDocument = null;
        try {
            // 打开 PDF 文件
            Log.d("extractPdfCover", "pdfDocument: " + filePath);
            File file = new File(filePath);
            pdfDocument = pdfiumCore.newDocument(ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY));

            // 渲染第一页
            pdfiumCore.openPage(pdfDocument, 0); // 第 0 页

            // 获取页面尺寸
            int width = pdfiumCore.getPageWidthPoint(pdfDocument, 0);
            int height = pdfiumCore.getPageHeightPoint(pdfDocument, 0);

            // 创建 Bitmap，渲染 PDF 至 Bitmap
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            pdfiumCore.renderPageBitmap(pdfDocument, bitmap, 0, 0, 0, width, height);

            // 保存封面图片到缓存
            saveBitmapToCache(cover, bitmap);

            // 通知更新封面
            WritableMap params = Arguments.createMap();
            params.putString("event", "COVER-READY");
            params.putMap("book", book.toWritableMap());
            sendEvent("BookChanged", params);

            // 回收 Bitmap 以释放内存
            bitmap.recycle();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            if (pdfDocument != null) {
                pdfiumCore.closeDocument(pdfDocument); // 确保关闭文档
            }
        }
    }

    private void saveBitmapToCache(File cover, Bitmap bitmap) {
        try (FileOutputStream outputStream = new FileOutputStream(cover)) {
            // 将 Bitmap 压缩并写入缓存文件
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
