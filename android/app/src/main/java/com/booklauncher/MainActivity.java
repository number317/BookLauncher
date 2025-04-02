package com.booklauncher;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.util.Log;
import com.facebook.react.ReactActivity;

import java.lang.reflect.Method;

public class MainActivity extends ReactActivity {
  private static final int REQUEST_CODE_STORAGE_PERMISSIONS = 101;
  private static final int REQUEST_CODE_MANAGE_EXTERNAL_STORAGE = 102;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    checkAndRequestStoragePermissions();
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    Log.i("PERMISSION", "current version " + Build.VERSION.SDK_INT);
    return "BookLauncher";
  }

  private void checkAndRequestStoragePermissions() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      // >= Android 11
      checkAndRequestManageExternalStoragePermission();
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      // Android 6 - Android 10
      checkAndRequestRuntimeStoragePermissions();
    } else {
      // <= Android 5.1
      Log.d("Permissions", "storage permission granted");
    }
  }

  private void checkAndRequestRuntimeStoragePermissions() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      String[] permissions = {
              Manifest.permission.READ_EXTERNAL_STORAGE,
              Manifest.permission.WRITE_EXTERNAL_STORAGE
      };

      boolean permissionsGranted = true;
      for (String permission : permissions) {
        if (isPermissionGranted(permission)) {
          permissionsGranted = false;
          break;
        }
      }

      if (permissionsGranted) {
        Log.d("Permissions", "storage permission granted");
      } else {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          requestPermissions(permissions, REQUEST_CODE_STORAGE_PERMISSIONS);
        }
      }
    }
  }

  private boolean isPermissionGranted(String permission) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      try {
        Method method = Context.class.getMethod("checkSelfPermission", String.class);
        return (int) method.invoke(this, permission) == PackageManager.PERMISSION_GRANTED;
      } catch (Exception e) {
        Log.e("Permissions", "Error checking permission", e);
      }
    }
    return true;
  }

  private void checkAndRequestManageExternalStoragePermission() {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          if (!Environment.isExternalStorageManager()) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            intent.setData(Uri.parse("package:" + getPackageName()));
            startActivityForResult(intent, REQUEST_CODE_MANAGE_EXTERNAL_STORAGE);
          } else {
            Log.d("Permissions", "MANAGE_EXTERNAL_STORAGE permission granted");
          }
      }
  }
}
