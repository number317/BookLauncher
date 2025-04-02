package com.booklauncher.module;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.FileObserver;
import android.util.Log;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class BookManager extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private FileObserver fileObserver;

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
                    WritableMap params = Arguments.createMap();
                    params.putString("event", getEventName(event));
                    params.putString("name", filename);
                    params.putString("type", isPdf ? "pdf" : "epub");
                    params.putString("path", booksDir.getAbsolutePath() + "/" + filename);

                    sendEvent("BookChanged", params);

                    if (event == FileObserver.DELETE || event == FileObserver.MOVED_FROM) {
                        String coverName = isPdf ? filename.replace(".pdf", ".jpg") : filename.replace(".epub", ".jpg");
                        String coverPath = booksDir.getAbsolutePath() + "/.cache/" + coverName;
                        Log.d("BookManager", "del cache cover " + coverPath);
                        try {
                            File file = new File(coverPath);
                            file.delete();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
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
            List<JSONObject> bookList = new ArrayList<>();
            File[] files = booksDir.listFiles();
            if (files != null) {
                for (File file : files) {
                    Log.i("BookManager", "find file " + file.getName());
                    if (file.isFile() && (file.getName().endsWith(".pdf")) || (file.getName().endsWith(".epub"))) {
                        JSONObject book = new JSONObject();
                        book.put("name", file.getName());
                        book.put("path", file.getAbsolutePath());
                        if (file.getName().endsWith(".pdf")) {
                            book.put("type", "pdf");
                        } else {
                            book.put("type", "epub");
                        }
                        bookList.add(book);
                    }
                }
            }
            JSONArray result = new JSONArray(bookList);
            promise.resolve(result.toString());
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void openBook(String filePath, Promise promise) {
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
}
