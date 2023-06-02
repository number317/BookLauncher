package com.booklauncher.module;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AppStatusBroadcastReceiver extends BroadcastReceiver {
    private ReactContext rnContext;

    public AppStatusBroadcastReceiver(ReactContext reactContext) {
        this.rnContext = reactContext;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        String packageName = intent.getData().getSchemeSpecificPart();

        if (Intent.ACTION_PACKAGE_ADDED.equals(action)) {
            sendEvent("AppInstalled", packageName);
        } else if (Intent.ACTION_PACKAGE_REPLACED.equals(action)) {
            sendEvent("AppUpdated", packageName);
        } else if (Intent.ACTION_PACKAGE_REMOVED.equals(action)) {
            boolean isReplacing = intent.getBooleanExtra(Intent.EXTRA_REPLACING, false);
            if (!isReplacing) {
                sendEvent("AppUninstalled", packageName);
            }
        }
    }

    private void sendEvent(String eventName, String packageName) {
        PackageManager packageManager = this.rnContext.getPackageManager();
        WritableMap eventParams = Arguments.createMap();
        String appName = "";
        eventParams.putString("eventName", eventName);
        eventParams.putString("packageName", packageName);
        if (!eventName.equals("AppUninstalled")) {
            try {
                ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, 0);
                appName = (String) packageManager.getApplicationLabel(applicationInfo);
                eventParams.putString("appName", appName);
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
            }
        }

        // 发送广播消息给 JavaScript 端
        rnContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("AppStatusEvent", eventParams);
    }
}
