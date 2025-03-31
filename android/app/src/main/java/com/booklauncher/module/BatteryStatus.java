package com.booklauncher.module;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class BatteryStatus extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private BroadcastReceiver batteryReceiver;

    public BatteryStatus(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "_BatteryStatus";
    }

    @ReactMethod
    public void getBatteryStatus(Promise promise) {
        try {
            IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = reactContext.registerReceiver(null, intentFilter);

            if (batteryStatus != null) {
                int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                float batteryPct = level * 100 / (float) scale;

                // 获取充电状态
                int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
                boolean isCharging = (status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL);

                // 返回结果
                WritableMap result = new WritableNativeMap();
                result.putDouble("batteryLevel", batteryPct);
                result.putBoolean("isCharging", isCharging);
                promise.resolve(result);
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }


    @ReactMethod
    public void startBatteryStatusListener() {
        if (batteryReceiver != null) return; // 防止重复注册

        batteryReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                float batteryPct = level * 100 / (float) scale;

                int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
                boolean isCharging = (status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL);

                // 发送事件到 JavaScript
                WritableMap params = new WritableNativeMap();
                params.putDouble("batteryLevel", batteryPct);
                params.putBoolean("isCharging", isCharging);

                sendEvent("BatteryStatusChanged", params);
            }
        };

        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        reactContext.registerReceiver(batteryReceiver, intentFilter); // 注册监听器
    }

    @ReactMethod
    public void stopBatteryStatusListener() {
        if (batteryReceiver != null) {
            reactContext.unregisterReceiver(batteryReceiver); // 注销监听器
            batteryReceiver = null;
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }
}
