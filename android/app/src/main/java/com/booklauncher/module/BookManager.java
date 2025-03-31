package com.booklauncher.module;

import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class BookManager extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public BookManager(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "_BookManager";
    }

    @ReactMethod
    public void getBookList(Promise promise) {
        try {
            File booksDir = new File(Environment.getExternalStorageDirectory(), "Books");
            if (!booksDir.exists() || !booksDir.isDirectory()) {
                booksDir.mkdir();
            }

            File cacheDir = new File(booksDir, ".cache");
            if (!cacheDir.exists()) {
                cacheDir.mkdirs();
            }

            List<JSONObject> bookList = new ArrayList<>();
            File[] files = booksDir.listFiles();
            if (files != null) {
                for (File file : files) {
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
            intent.setDataAndType(Uri.parse("file://" + filePath), "application/pdf");
            intent.setPackage("org.koreader.launcher");
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve("open success");
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }
}
