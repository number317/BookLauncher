import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { set, runInAction } from 'mobx';
import {
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import TopStatus from '../../components/top-status';
import Time from '../../components/time';
import Modal from '../../components/modal';
import { setLocalData } from '../../components/global-store';
import NavigationBar from '../../components/navigation-bar';
import { AppIconView } from '../../components/native-components';
import Store from '../../store';
import styles from './style';

const { _AppManager } = NativeModules;

const AppHome = () => {
  const { rootStore } = useContext(Store);
  const {
    formatMessage,
    appLoading,
    appList,
    appPadding,
    appPageSize,
    currentAppPage,
  } = rootStore;

  const [showAppInfo, setShowAppInfo] = useState(false);

  const handleStartApp = (appInfo) => {
    _AppManager.launchApp(appInfo.packageName);
  };

  const handleShowAppInfo = (appInfo) => {
    setShowAppInfo(appInfo);
  };

  const handleUninstallApp = (appInfo) => {
    setShowAppInfo(false);
    _AppManager.uninstallApp(appInfo.packageName);
  }

  const handleHideApp = (appInfo) => {
    runInAction(() => {
      set(appInfo, 'hide', true);
    });
    setShowAppInfo(false);
    const cacheAppList = rootStore.appList.slice();
    setLocalData('appList', cacheAppList);
  }

  const renderAppList = () => {
    if (rootStore.appMode === 'book') {
      return (
        <View style={{ ...styles.appContainer, paddingHorizontal: appPadding[0], paddingVertical: appPadding[1] }}>
          {appList.filter(appInfo => !appInfo.hide).slice((currentAppPage- 1) * appPageSize, currentAppPage * appPageSize).map((appInfo) => (
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
      );
    } else {
      return (
        <ScrollView style={styles.appList}>
          {appList.filter(appInfo => !appInfo.hide).map((appInfo) => (
            <View style={styles.appItem} key={appInfo.packageName}>
              <Pressable
                onPress={() => handleStartApp(appInfo)}
                onLongPress={() => handleShowAppInfo(appInfo)}
              >
                <Text style={styles.appItemName} numberOfLines={1} ellipsizeMode="tail">
                  {appInfo.appName}
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      );
    }
  };

  return (
    <View style={rootStore.appMode === 'book' ? styles.bookContainer : styles.simpleContainer}>
      <NavigationBar currentMenu="App" />
      {rootStore.appMode === 'simple' && <TopStatus />}
      {rootStore.appMode === 'simple' && <Time />}
      {
        appLoading ? (
          <View style={styles.loading}>
            <Text>{rootStore.formatMessage('app.list.reading')}</Text>
          </View>
        ) : renderAppList()
      }
      {
        rootStore.appMode === 'book' && Math.ceil(appList.length / appPageSize) > 1 && !appLoading && (
          <View style={styles.pagination}>
            {
              new Array(Math.ceil(appList.length / appPageSize)).fill('0').map((_, index) => (
                  <TouchableOpacity onPress={() => rootStore.setCurrentAppPage(index + 1)} key={index}>
                    <Text>{index + 1 === currentAppPage ? '●' : '○'}</Text>
                  </TouchableOpacity>
              ))
            }
          </View>
        )
      }
      {
        showAppInfo && (
          <Modal handleClose={() => setShowAppInfo(false)}>
            <View style={styles.modal}>
              <AppIconView
                style={styles.appIcon}
                packageName={showAppInfo.packageName}
              />
              <Text>{showAppInfo.appName}</Text>
              <Text>{showAppInfo.packageName}</Text>
              <TouchableOpacity onPress={() => handleUninstallApp(showAppInfo)}>
                <Text>{formatMessage('uninstall')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleHideApp(showAppInfo)}>
                <Text>{formatMessage('hide')}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )
      }
    </View>
  )
};

export default observer(AppHome);
