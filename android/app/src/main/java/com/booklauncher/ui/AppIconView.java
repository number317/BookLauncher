package com.booklauncher.ui;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;

public class AppIconView extends androidx.appcompat.widget.AppCompatImageView {
    public AppIconView(Context context) {
        super(context);
    }

    public void setAppIcon(String packageName) {
        try {
            PackageManager packageManager = getContext().getPackageManager();
            ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
            Drawable icon = appInfo.loadIcon(packageManager);
            setImageDrawable(icon);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
