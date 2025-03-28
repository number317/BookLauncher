import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StatusBar, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookHome from './react/routes/book-home';
import AppHome from './react/routes/app-home';
import Setting from './react/routes/setting';
import Store from './react/store';

const Stack = createNativeStackNavigator();

const Router = () => {
  const { rootStore } = useContext(Store);
  return rootStore.appMode ? (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator
        initialRouteName={rootStore.appMode === 'book' ? 'Book' : 'App'}
        screenOptions={{ animation: 'none', headerShown: false }}
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
