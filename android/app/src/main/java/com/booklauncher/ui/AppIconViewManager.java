package com.booklauncher.ui;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class AppIconViewManager extends SimpleViewManager<AppIconView> {

    @NonNull
    @Override
    public String getName() {
        return "AppIconView";
    }

    @NonNull
    @Override
    protected AppIconView createViewInstance(ThemedReactContext reactContext) {
        return new AppIconView(reactContext);
    }

    @ReactProp(name = "packageName")
    public void setAppIcon(AppIconView view, String packageName) {
        view.setAppIcon(packageName);
    }
}
