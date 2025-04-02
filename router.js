import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StatusBar, View, Text, NativeModules, NativeEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookHome from './react/routes/book-home';
import AppHome from './react/routes/app-home';
import Setting from './react/routes/setting';
import Store from './react/store';

const Stack = createNativeStackNavigator();
const { _BookManager } = NativeModules;
const bookEventEmitter = new NativeEventEmitter(_BookManager);

const Router = () => {
  const { rootStore } = useContext(Store);

  const handleBookChange = (data) => {
    const { event, name, type, path } = data;
    console.info('info: event, path', event, path);
    const book = {
      name,
      path,
      type,
    };
    const old = rootStore.bookList.slice();
    switch (event) {
      case 'CREATE':
        if (old.some(item => item.path === path)) {
          return;
        }
        rootStore.setBookList([book, ...old]);
        break;
      case 'DELETE':
        rootStore.setBookList(old.filter(item => item.path !== path));
        break;
      default:
        console.info('info: unknow book event', event);
    }
  };

  useEffect(() => {
    if (rootStore.appMode === 'book') {
      _BookManager.initWatch();
      _BookManager.startWatch().then((res) => {
        console.info('info: start watch: ', res);
      }).catch((error) => {
        console.error('error: start watch', error);
      });
      bookEventEmitter.addListener('BookChanged', handleBookChange);
    } else {
      _BookManager.stopWatch().then((res) => {
        console.info('info: stop watch: ', res);
      }).catch((error) => {
        console.error('error: stop watch', error);
      });
    }

    return () => {
      _BookManager.stopWatch();
      bookEventEmitter.removeListener('BookChanged', handleBookChange);
    }
  }, [rootStore.appMode]);

  return rootStore.appMode ? (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator
        initialRouteName={rootStore.appMode === 'book' ? 'Book' : 'App'}
        screenOptions={{
          animation: 'none',
          headerShown: false,
          animationEnabled: false,
          useNativeDriver: true,
        }}
      >
        <Stack.Screen name="App" component={AppHome} />
        <Stack.Screen name="Book" component={BookHome} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{rootStore.formatMessage('init')}</Text>
    </View>
  );
};

export default observer(Router);
