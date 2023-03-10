import React from 'react';
import { useSelector } from 'react-redux';
import { AuthStackNavigator } from '@screens/auth/navigation/AuthStack';

export enum LastRoutes {
  Business = 'Business',
  Favourite = 'Favourite',
}

export const withAuthRedirection = (WrappedComponent: React.FC<any>) => {
  return (props: any) => {
    const isLogin = useSelector((state: any) => state.auth.isLogin);
    if (!isLogin) {
      return <AuthStackNavigator {...props} />;
    }
    return <WrappedComponent {...props} />;
  };
};
