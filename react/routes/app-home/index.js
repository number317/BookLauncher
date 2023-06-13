import React, { useState } from 'react';
import {
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  Pressable,
  requireNativeComponent,
} from 'react-native';
import Modal from '../../components/modal';
import { getLocalData, setLocalData } from '../../components/global-store';
import NavigationBar from '../../components/navigation-bar';
import styles from './style';

const { PkgManager } = NativeModules;
const AppIconView = requireNativeComponent('AppIconView');

const AppHome = (props) => {
  const {
    appLoading,
    appList,
    setAppList,
    appPadding,
    appPageSize,
  } = props;

  const [showAppInfo, setShowAppInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleStartApp = (appInfo) => {
    PkgManager.launchApp(appInfo.packageName);
  };

  const handleShowAppInfo = (appInfo) => {
    setShowAppInfo(appInfo);
  };

  const handleUninstallApp = (appInfo) => {
    setShowAppInfo(false);
    PkgManager.uninstallApp(appInfo.packageName);
  }

  const handleHideApp = (appInfo) => {
    setAppList(old => old.filter(item => item.packageName !== appInfo.packageName));
    getLocalData('hideList', (hideList = []) => {
      setLocalData('hideList', [...hideList, appInfo.packageName]);
    })
    setShowAppInfo(false);
  }

  return (
    <View style={styles.main}>
      <NavigationBar currentMenu="App" />
      {
        appLoading ? (
          <View style={styles.loading}>
            <Text>loading...</Text>
          </View>
        ) : (
          <View style={{ ...styles.appContainer, paddingHorizontal: appPadding[0], paddingVertical: appPadding[1] }}>
            {appList.slice((currentPage- 1) * appPageSize, currentPage * appPageSize).map((appInfo) => (
              <View style={styles.appCard} key={appInfo.packageName}>
                <Pressable
                  onPress={() => handleStartApp(appInfo)}
                  onLongPress={() => handleShowAppInfo(appInfo)}
                >
                  <View style={styles.appInner}>
                    <AppIconView
                      style={styles.appIcon}
                      packageName={appInfo.packageName}
                    />
                    <Text style={styles.appName} numberOfLines={1} ellipsizeMode="tail">
                      {appInfo.appName}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )
      }
      {
        Math.ceil(appList.length / appPageSize) > 1 && !appLoading && (
          <View style={styles.pagination}>
            {
              new Array(Math.ceil(appList.length / appPageSize)).fill('0').map((_, index) => (
                  <TouchableOpacity onPress={() => setCurrentPage(index + 1)} key={index}>
                    <Text>{index + 1 === currentPage ? '●' : '○'}</Text>
                  </TouchableOpacity>
              ))
            }
          </View>
        ) 
      }
      {
        showAppInfo && (
          <Modal>
            <View style={styles.modal}>
              <AppIconView
                style={styles.appIcon}
                packageName={showAppInfo.packageName}
              />
              <Text>{showAppInfo.appName}</Text>
              <Text>{showAppInfo.packageName}</Text>
              <TouchableOpacity onPress={() => handleUninstallApp(showAppInfo)}>
                <Text>卸载</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleHideApp(showAppInfo)}>
                <Text>隐藏</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAppInfo(false)}>
                <Text>关闭</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )
      }
    </View>
  );
};

export default AppHome;
