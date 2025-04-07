import React, { createContext, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import RootStore from './RootStore';
import { setLocalData } from '../components/global-store';

const { _AppManager, _BatteryStatus } = NativeModules;
const appEventEmitter = new NativeEventEmitter(_AppManager);
const batteryEventEmitter = new NativeEventEmitter(_BatteryStatus);

const Store = createContext();

const StoreProvider = (props) => {
  const { children } = props;
  const rootStore = RootStore();

  const handleAppChange = (event) => {
    /*
     * eventName: AppInstalled, AppUpdated, AppUninstalled
     */
    const { eventName, packageName, appName } = event;
    const old = rootStore.appList.slice();
    let updateApp;
    switch (eventName) {
      case 'AppInstalled':
        console.info('info: new app install', packageName);
        if (old.some(appInfo => appInfo.packageName === packageName)) {
          return;
        }
        rootStore.setAppList([...old, { appName, packageName }]);
        break;
      case 'AppUpdated':
        updateApp = old.find(appInfo => appInfo.packageName === packageName);
        updateApp.appName = appName;
        rootStore.setAppList(old);
        setLocalData('appList', rootStore.appList.slice());
        break;
      case 'AppUninstalled':
        console.info('info: app uninstall', packageName);
        rootStore.setAppList(old.filter(appInfo => appInfo.packageName !== packageName));
        break;
      default:
        console.info('info: unknow app event', eventName);
    }
    setLocalData('appList', rootStore.appList.slice());
  };

  const handleBatteryChange = (event) => {
    const { batteryLevel, isCharging } = event;
    rootStore.setBatteryLevel(batteryLevel);
    rootStore.setIsCharging(isCharging);
  };

  useEffect(() => {
    rootStore.queryLocalLang();
  }, []);

  useEffect(() => {
    const init = async () => {
      rootStore.setAppLoading(true);
      const [hello, appMode, lang] = await rootStore.queryCacheConfig();
      if (lang) {
        rootStore.setLang(lang);
      }
      rootStore.setHello(hello || 'Hello world!');
      rootStore.setAppMode(appMode || 'book');

      const batteryInfo = await _BatteryStatus.getBatteryStatus();
      rootStore.setBatteryLevel(batteryInfo.batteryLevel);
      rootStore.setIsCharging(batteryInfo.isCharging);

      rootStore.setAppLoading(false);
    };

    init();
    _AppManager.registerAppStatusListener();
    const appStatusListener = appEventEmitter.addListener('AppStatusEvent', handleAppChange);

    _BatteryStatus.startBatteryStatusListener();
    batteryEventEmitter.addListener('BatteryStatusChanged', handleBatteryChange);

    rootStore.queryAppList();
    return () => {
      _AppManager.unregisterAppStatusListener();
      appStatusListener.remove();

      batteryEventEmitter.removeListener('BatteryStatusChanged', handleBatteryChange);
      _BatteryStatus.stopBatteryStatusListener();
    }
  }, []);

  const value = {
    rootStore,
    ...props,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
};

export { StoreProvider };
export default Store;
