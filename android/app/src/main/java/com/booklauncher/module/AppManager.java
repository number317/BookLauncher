package com.booklauncher.module;

import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.*;

import java.util.List;

public class AppManager extends ReactContextBaseJavaModule {
    private final ReactApplicationContext rnContext;
    private AppStatusBroadcastReceiver appStatusReceiver;

    @NonNull
    @Override
    public String getName() {
        return "_AppManager";
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

    @ReactMethod
    public void uninstallApp(String packageName) {
        Uri packageUri = Uri.parse("package:" + packageName);
        Intent uninstallIntent = new Intent(Intent.ACTION_UNINSTALL_PACKAGE, packageUri);
        uninstallIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getCurrentActivity().startActivity(uninstallIntent);
    }

    @ReactMethod
    public void registerAppStatusListener() {
        this.appStatusReceiver = new AppStatusBroadcastReceiver(this.rnContext);

        // 注册广播接收器
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        intentFilter.addAction(Intent.ACTION_PACKAGE_REPLACED);
        intentFilter.addAction(Intent.ACTION_PACKAGE_REMOVED);
        intentFilter.addDataScheme("package");
        getReactApplicationContext().registerReceiver(appStatusReceiver, intentFilter);
    }

    @ReactMethod
    public void unregisterAppStatusListener() {
        // 注销广播接收器
        if (this.appStatusReceiver != null) {
            getReactApplicationContext().unregisterReceiver(appStatusReceiver);
            appStatusReceiver = null;
        }
    }
}
