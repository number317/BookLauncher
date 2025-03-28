import React from 'react';
import { StoreProvider } from './react/store';
import Router from './router';

const App = () => (
  <StoreProvider>
    <Router />
  </StoreProvider>
);

export default App;
