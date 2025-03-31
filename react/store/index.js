import React, { createContext, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import RootStore from './RootStore';
import {setLocalData} from '../components/global-store';

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
    switch (eventName) {
      case 'AppInstalled':
        rootStore.setAppList(old => [...old, { appName, packageName }]);
        break;
      case 'AppUpdated':
        rootStore.setAppList(old => {
          const newList = old.slice();
          const updateApp = newList.find(appInfo => appInfo.packageName === packageName);
          updateApp.appName = appName;
          return newList;
        });
        setLocalData('appList', rootStore.appList.slice());
        break;
      case 'AppUninstalled':
        rootStore.setAppList(old => old.filter(appInfo => appInfo.packageName !== packageName));
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
    const init = async () => {
      rootStore.setAppLoading(true);
      rootStore.queryBookList();
      const [hello, appMode, lang] = await rootStore.queryCacheConfig();
      rootStore.setHello(hello || 'Hello world!');
      rootStore.setAppMode(appMode || 'book');
      if (lang) {
        rootStore.setLang(lang);
      } else {
        await rootStore.queryLocalLang();
      }

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
