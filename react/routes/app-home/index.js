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
  FlatList,
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
    appRows,
    appColumns,
    appCardSize,
    appPages,
    appCurrentPage,
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
        <FlatList
          data={appList.filter(appInfo => !appInfo.hide).slice((appCurrentPage- 1) * appRows * appColumns, appCurrentPage * appRows * appColumns)}
          keyExtractor={(item) => item.packageName}
          numColumns={appColumns}
          pagingEnable
          showHorizontalScrollIndicator={false}
          showVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => renderApp(item, index)}
        />
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

  const renderApp = (appInfo) => (
    <View style={{ ...styles.appCard, width: appCardSize, height: appCardSize }} key={appInfo.packageName}>
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
  );

  return (
    <View style={styles.wrap}>
      <TopStatus />
      <View style={rootStore.appMode === 'book' ? styles.main : styles.simple}>
        <NavigationBar currentMenu="App" />
        {rootStore.appMode === 'simple' && <Time />}
        {
          appLoading ? (
            <View style={styles.loading}>
              <Text>{rootStore.formatMessage('app.list.reading')}</Text>
            </View>
          ) : renderAppList()
        }
        {
          showAppInfo && (
            <Modal handleClose={() => setShowAppInfo(false)} style={styles.modal}>
              <View style={styles.modalContainer}>
                <AppIconView
                  style={styles.appIcon}
                  packageName={showAppInfo.packageName}
                />
                <Text>{showAppInfo.appName}</Text>
                <Text>{showAppInfo.packageName}</Text>
                <View style={styles.action}>
                  <TouchableOpacity onPress={() => handleUninstallApp(showAppInfo)}>
                    <Text>{formatMessage('uninstall')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleHideApp(showAppInfo)}>
                    <Text>{formatMessage('hide')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )
        }
      </View>
    </View>
  )
};

export default observer(AppHome);
