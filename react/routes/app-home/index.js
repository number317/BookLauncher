import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  NativeModules,
  Dimensions,
  TouchableOpacity,
  Pressable,
  requireNativeComponent,
} from 'react-native';
import Modal from '../../components/modal';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const { PkgManager } = NativeModules;
const AppIconView = requireNativeComponent('AppIconView');

const AppHome = (props) => {
  const { stores } = props;

  const { appList } = stores;

  const [showAppInfo, setShowAppInfo] = useState(false);
  const [padding, setPadding] = useState(0);

  useEffect(() => {
    const { width } = Dimensions.get('window');
    const appCountPerLine = Math.floor(width / 110);
    const bodyPadding = (width - appCountPerLine * 110) / 2;
    setPadding(bodyPadding);
  }, []);

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
    console.info('info: hide', appInfo);
  }

  return (
    <View style={styles.main}>
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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View style={{ ...styles.body, paddingHorizontal: padding }}>
          {appList.map((appInfo) => (
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.white,
  },
  scrollView: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  appCard: {
    width: 110,
    height: 110,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  appIcon: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 10,
  },
  centerView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    height: 200,
    width: 300,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default AppHome;
