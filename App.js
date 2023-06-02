import React, { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppHome from './react/routes/app-home';

const { PkgManager } = NativeModules;
const appEventEmitter = new NativeEventEmitter(PkgManager);

const App = () => {
  const [appList, setAppList] = useState([]);

  const handleAppChange = (event) => {
    /*
     * eventName: AppInstalled, AppUpdated, AppUninstalled
    */
    const { eventName, packageName, appName } = event;
    console.info('info: app change', eventName, packageName);
    switch (eventName) {
      case 'AppInstalled':
        setAppList(old => [...old, { appName, packageName }]);
        break;
      case 'AppUpdated':
        setAppList(old => {
          const newList = old.slice();
          const updateApp = newList.find(appInfo => appInfo.packageName === packageName);
          updateApp.appName = appName;
          return newList;
        });
        break;
      case 'AppUninstalled':
      setAppList(old => old.filter(appInfo => appInfo.packageName !== packageName));
        break;
      default:
        console.info('info: unknow event', eventName);
    }
  };

  useEffect(() => {
    PkgManager.registerAppStatusListener();
    PkgManager.getAppList((result) => {
      setAppList(result);
    });
    const appStatusListener = appEventEmitter.addListener('AppStatusEvent', handleAppChange);

    return () => {
      PkgManager.unregisterAppStatusListener();
      appStatusListener.remove();
    }
  }, []);

  return (
    <NavigationContainer>
      <AppHome stores={{ appList, setAppList }} />
    </NavigationContainer>
  );
};

export default App;
