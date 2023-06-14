package com.booklauncher.module;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Locale;

public class LocalInfo extends ReactContextBaseJavaModule {
    public LocalInfo(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "_LocalInfo";
    }

    @ReactMethod
    public void getLocalLanguage(Callback callback) {
        Locale locale = Locale.getDefault();
        String currentLang = locale.getLanguage();
        callback.invoke(currentLang);
    }
}
