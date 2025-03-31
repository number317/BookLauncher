import React, { createContext, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import RootStore from './RootStore';
import {setLocalData} from '../components/global-store';

const { _AppManager } = NativeModules;
const appEventEmitter = new NativeEventEmitter(_AppManager);

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

  useEffect(() => {
    const init = async () => {
      rootStore.setAppLoading(true);
      const [hello, appMode, lang] = await rootStore.queryCacheConfig();
      rootStore.setHello(hello || 'Hello world!');
      rootStore.setAppMode(appMode || 'book');
      if (lang) {
        rootStore.setLang(lang);
      } else {
        await rootStore.queryLocalLang();
      }
      rootStore.setAppLoading(false);
    };

    init();
    _AppManager.registerAppStatusListener();
    const appStatusListener = appEventEmitter.addListener('AppStatusEvent', handleAppChange);

    rootStore.queryAppList();
    return () => {
      _AppManager.unregisterAppStatusListener();
      appStatusListener.remove();
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
