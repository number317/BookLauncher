import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StoreProvider } from './react/store';
import BookHome from './react/routes/book-home';
import AppHome from './react/routes/app-home';
import Setting from './react/routes/setting';

const Stack = createNativeStackNavigator();

const App = () => (
  <StoreProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Book"
        screenOptions={{ animation: 'none', headerShown: false }}
      >
        <Stack.Screen name="App" component={AppHome} />
        <Stack.Screen name="Book" component={BookHome} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  </StoreProvider>
);

export default App;
