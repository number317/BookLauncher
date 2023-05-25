package com.booklauncher.ui;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import com.booklauncher.R;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.TouchEvent;
import com.facebook.react.uimanager.events.TouchEventCoalescingKeyHelper;
import com.facebook.react.uimanager.events.TouchEventType;

public class AppIconView extends LinearLayout {
    private ImageView iconImageView;

    public AppIconView(Context context) {
        super(context);
        init();
    }

    private void init() {
        inflate(getContext(), R.layout.app_icon_view, this);
        iconImageView = findViewById(R.id.iconImageView);
        setClickable(true);

        setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent event) {
                int action = event.getAction();
                switch (action) {
                    case MotionEvent.ACTION_DOWN:
                        viewDispatchTouchEvent(event, TouchEventType.START);
                        break;
                    case MotionEvent.ACTION_UP:
                        viewDispatchTouchEvent(event, TouchEventType.END);
                        break;
                }
                return true;
            }
        });
    }

    private void viewDispatchTouchEvent(MotionEvent event, TouchEventType touchEventType) {
        ReactContext reactContext = (ReactContext) getContext();
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        TouchEventCoalescingKeyHelper keyHelper = new TouchEventCoalescingKeyHelper();
        uiManager.getEventDispatcher()
                .dispatchEvent(
                        TouchEvent.obtain(getId(), touchEventType, event, event.getDownTime(), event.getX(), event.getY(), keyHelper)
                );
    }

    public void setAppIcon(String packageName) {
        try {
            PackageManager packageManager = getContext().getPackageManager();
            ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
            Drawable icon = appInfo.loadIcon(packageManager);
            iconImageView.setImageDrawable(icon);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
