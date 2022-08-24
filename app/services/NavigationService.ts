import * as React from 'react';
import { MutableRefObject } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/models/RootStackParamList';

export const isReadyRef = React.createRef() as MutableRefObject<boolean>;

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate(name: any, params: any) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
