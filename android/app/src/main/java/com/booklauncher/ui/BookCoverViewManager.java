package com.booklauncher.ui;

import androidx.annotation.NonNull;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class BookCoverViewManager extends SimpleViewManager<BookCoverView> {
    @NonNull
    @Override
    public String getName() {
        return "BookCoverView";
    }

    @NonNull
    @Override
    protected BookCoverView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new BookCoverView(reactContext);
    }

    @ReactProp(name = "filePath")
    public void setFilePath(BookCoverView view, String filePath) {
        view.setFilePath(filePath);
    }
}
