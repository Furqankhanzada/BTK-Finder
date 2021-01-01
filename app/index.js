import React from 'react';
import { store } from 'app/store';
import { Provider } from 'react-redux';
import Navigator from './navigation';

console.disableYellowBox = true;

export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
