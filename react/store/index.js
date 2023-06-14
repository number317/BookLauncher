import React, { createContext, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Dimensions } from 'react-native';
import GlobalConfig from '../components/global-config';
import RootStore from './RootStore';

const { _AppManager } = NativeModules;
const appEventEmitter = new NativeEventEmitter(_AppManager);

const { NAVIGATION_BAR_WIDTH, APP_CARD_WIDTH, APP_CARD_HEIGHT } = GlobalConfig;

const Store = createContext();

const StoreProvider = (props) => {
  const { children } = props;
  const rootStore = RootStore();

  const handleAppChange = (event) => {
    /*
     * eventName: AppInstalled, AppUpdated, AppUninstalled
    */
    const { eventName, packageName, appName } = event;
    console.info('info: app change', eventName, packageName);
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
        break;
      case 'AppUninstalled':
      rootStore.setAppList(old => old.filter(appInfo => appInfo.packageName !== packageName));
        break;
      default:
        console.info('info: unknow app event', eventName);
    }
  };

  useEffect(() => {
    rootStore.setAppLoading(true);
    rootStore.queryLocalLang();
    rootStore.loadHideList();

    _AppManager.registerAppStatusListener();
    const appStatusListener = appEventEmitter.addListener('AppStatusEvent', handleAppChange);

    _AppManager.getAppList((result) => {
      const showList = result.filter(appInfo => !rootStore.hideList.includes(appInfo.packageName));
      rootStore.setAppList(showList);

      const { width, height } = Dimensions.get('window');
      const appCountPerLine = Math.floor((width - NAVIGATION_BAR_WIDTH) / APP_CARD_WIDTH);
      const appPaddingHorizontal = (width - appCountPerLine * APP_CARD_WIDTH - NAVIGATION_BAR_WIDTH) / 2;

      const appCountPerColumn = Math.floor(height / APP_CARD_HEIGHT);
      const appPaddingVertical = (height - appCountPerColumn * APP_CARD_HEIGHT) / 2;

      const pageSizeApp = appCountPerLine * appCountPerColumn;

      rootStore.setAppPageSize(pageSizeApp);
      rootStore.setAppPadding([appPaddingHorizontal, appPaddingVertical]);
      rootStore.setAppLoading(false);
    });

    return () => {
      _AppManager.unregisterAppStatusListener();
      appStatusListener.remove();
    }
  }, [rootStore.hideList]);

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
