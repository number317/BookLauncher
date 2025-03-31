package com.booklauncher;
import com.booklauncher.module.AppManager;
import com.booklauncher.module.BatteryStatus;
import com.booklauncher.module.BookManager;
import com.booklauncher.module.LocalInfo;
import com.booklauncher.ui.AppIconViewManager;
import com.booklauncher.ui.BookCoverViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class MyModulePackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new AppIconViewManager());
        viewManagers.add(new BookCoverViewManager());
        return viewManagers;
    }

    @Override
    public List<NativeModule> createNativeModules( ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new AppManager(reactContext));
        modules.add(new LocalInfo(reactContext));
        modules.add(new BatteryStatus(reactContext));
        modules.add(new BookManager(reactContext));

        return modules;
    }
}
