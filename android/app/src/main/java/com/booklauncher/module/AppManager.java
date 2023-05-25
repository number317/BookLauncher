package com.booklauncher.module;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.*;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class AppManager extends ReactContextBaseJavaModule {
    private final ReactApplicationContext rnContext;

    @NonNull
    @Override
    public String getName() {
        return "PkgManager";
    }

    public AppManager(ReactApplicationContext context) {
        super(context);
        this.rnContext = context;
    }

    @ReactMethod
    public void getAppList(Callback callBack) {
        Intent mainIntent;
        PackageManager packageManager = this.rnContext.getPackageManager();
        List<PackageInfo> installedPackages = packageManager.getInstalledPackages(0);
        WritableArray appList = Arguments.createArray();

        for (PackageInfo packageInfo : installedPackages) {
            ApplicationInfo appInfo = packageInfo.applicationInfo;
            mainIntent = packageManager.getLaunchIntentForPackage(appInfo.packageName);
            if (mainIntent != null) {
                WritableMap appMap = Arguments.createMap();
                appMap.putString("appName", appInfo.loadLabel(packageManager).toString());
                appMap.putString("packageName", appInfo.packageName);
                appList.pushMap(appMap);
            }
        }
        Log.d("app list", appList.toString());
        callBack.invoke(appList);
    }

    @ReactMethod
    public void launchApp(String packageName) {
        Intent intent;
        PackageManager packageManager = this.rnContext.getPackageManager();
        intent = packageManager.getLaunchIntentForPackage(packageName);
        if (intent != null) {
            this.rnContext.startActivity(intent);
        }
    }
}
