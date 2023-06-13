import React, { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getLocalData } from './react/components/global-store';
import ConstData from './react/components/const-data';
import BookHome from './react/routes/book-home';
import AppHome from './react/routes/app-home';
import Setting from './react/routes/setting';

const Stack = createNativeStackNavigator();
const { PkgManager } = NativeModules;
const appEventEmitter = new NativeEventEmitter(PkgManager);

const { NAVIGATION_BAR_WIDTH, APP_CARD_WIDTH, APP_CARD_HEIGHT } = ConstData;

const App = () => {
  const [hideList, setHideList] = useState([]);
  const [appList, setAppList] = useState([]);

  const [appLoading, setAppLoading] = useState(true);
  const [appPadding, setAppPadding] = useState([]);
  const [appPageSize, setAppPageSize] = useState(0);

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
      getLocalData('hideList', (data = []) => {
        setHideList(data);
      })
  }, []);

  useEffect(() => {
    setAppLoading(true);
    PkgManager.registerAppStatusListener();
    PkgManager.getAppList((result) => {
      const showList = result.filter(appInfo => !hideList.includes(appInfo.packageName));
      setAppList(showList);

      const { width, height } = Dimensions.get('window');
      const appCountPerLine = Math.floor((width - NAVIGATION_BAR_WIDTH) / APP_CARD_WIDTH);
      const appPaddingHorizontal = (width - appCountPerLine * APP_CARD_WIDTH - NAVIGATION_BAR_WIDTH) / 2;

      const appCountPerColumn = Math.floor(height / APP_CARD_HEIGHT);
      const appPaddingVertical = (height - appCountPerColumn * APP_CARD_HEIGHT) / 2;

      const pageSizeApp = appCountPerLine * appCountPerColumn;

      setAppPageSize(pageSizeApp);
      setAppPadding([appPaddingHorizontal, appPaddingVertical]);
      setAppLoading(false);

    });
    const appStatusListener = appEventEmitter.addListener('AppStatusEvent', handleAppChange);

    return () => {
      PkgManager.unregisterAppStatusListener();
      appStatusListener.remove();
    }
  }, [hideList]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Book"
        screenOptions={{ animation: 'none', headerShown: false }}
      >
        <Stack.Screen name="App">
          {() => (
            <AppHome
              appLoading={appLoading}
              appList={appList}
              setAppList={setAppList}
              appPadding={appPadding}
              appPageSize={appPageSize}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Book">
          {() => <BookHome />}
        </Stack.Screen>
        <Stack.Screen name="Setting">
          {() => <Setting />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
