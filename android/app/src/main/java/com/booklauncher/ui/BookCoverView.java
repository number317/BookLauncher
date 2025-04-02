package com.booklauncher.ui;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import com.shockwave.pdfium.PdfDocument;
import com.shockwave.pdfium.PdfiumCore;

import java.io.*;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public class BookCoverView extends androidx.appcompat.widget.AppCompatImageView {
    private String filePath;
    private String cacheFilePath;
    private String fileType;

    private static final String cacheDir = Environment.getExternalStorageDirectory() + "/Books/.cache";

    public BookCoverView(Context context) {
        super(context);
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
        this.cacheFilePath = cacheDir + "/" + new File(filePath).getName().split("\\.")[0] + ".jpg";
        File bookFile = new File(filePath);
        if (filePath.endsWith("pdf")) {
            setFileType("pdf");
        } else if (filePath.endsWith("epub")) {
            setFileType("epub");
        }
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
        loadCover();
    }

    private void loadCover() {
        if (filePath == null || fileType == null) {
            return;
        }

        try {
            if ("epub".equals(fileType)) {
                extractEpubCover(filePath);
            } else if ("pdf".equals(fileType)) {
                extractPdfCover(filePath);
            }
            this.setImageURI(Uri.parse(cacheFilePath));
        } catch (Exception e) {
            Log.e("BookCoverView", "Failed to load cover: " + e.getMessage());
        }
    }

    private void extractEpubCover(String filePath) throws Exception {
        ZipFile epubFile = null;
        try {
            epubFile = new ZipFile(filePath);
            ZipEntry opfEntry = null;
            ZipEntry coverEntry = null;

            // 遍历 ZIP 文件找到 content.opf
            Enumeration<? extends ZipEntry> entries = epubFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                if (entry.getName().endsWith("content.opf")) {
                    opfEntry = entry;
                    break;
                }
            }

            if (opfEntry == null) {
                throw new Exception("content.opf not found");
            }

            // 读取 content.opf 并提取封面路径
            InputStream opfInputStream = epubFile.getInputStream(opfEntry);
            String relativeCoverPath = parseOpfForCoverPath(opfInputStream);

            if (relativeCoverPath != null) {
                // 获取 opf 的路径并拼接封面路径
                String opfPath = opfEntry.getName(); // e.g., "OEBPS/content.opf"
                String baseDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1); // e.g., "OEBPS/"
                String coverPath = baseDir + relativeCoverPath;

                coverEntry = epubFile.getEntry(URLDecoder.decode(coverPath));
            }

            if (coverEntry == null) {
                throw new Exception("Cover image not found");
            }

            // 保存cover为缓存图片
            InputStream coverInputStream = epubFile.getInputStream(coverEntry);
            File cacheFile = new File(cacheFilePath);

            try (FileOutputStream fileOutputStream = new FileOutputStream(cacheFile)) {
                byte[] buffer = new byte[1024];
                int length;
                while ((length = coverInputStream.read(buffer)) > 0) {
                    fileOutputStream.write(buffer, 0, length);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        } finally {
            if (epubFile != null) {
                epubFile.close();
            }
        }
    }
    private String parseOpfForCoverPath(InputStream opfInputStream) throws Exception {
        // 简单XML解析：这里以手动的方式解析 XML，可以替换成更强大的 XML 库（如 DOM 或 SAX）
        // 解析内容应该是形如：
        // <meta name="cover" content="cover-id" />
        // 并通过 cover-id 找到对应的 <item> 内容
        // <item id="cover-id" href="cover.jpg" media-type="image/jpeg" />
        BufferedReader reader = new BufferedReader(new InputStreamReader(opfInputStream));
        String line;
        String coverId = null;
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
    private void extractPdfCover(String filePath) throws Exception {
        PdfiumCore pdfiumCore = new PdfiumCore(getContext());
        PdfDocument pdfDocument = null;
        try {
            // 打开 PDF 文件
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
            saveBitmapToCache(filePath, bitmap);

            // 回收 Bitmap 以释放内存
            bitmap.recycle();
            bitmap = null;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            if (pdfDocument != null) {
                pdfiumCore.closeDocument(pdfDocument); // 确保关闭文档
            }
        }
    }

    private void saveBitmapToCache(String filePath, Bitmap bitmap) {
        File cacheFile = new File(cacheFilePath);

        try (FileOutputStream outputStream = new FileOutputStream(cacheFile)) {
            // 将 Bitmap 压缩并写入缓存文件
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

