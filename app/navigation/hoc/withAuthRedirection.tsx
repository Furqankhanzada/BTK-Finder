import React from 'react';
import { useSelector } from 'react-redux';
import WelcomeAuthScreen from '@screens/auth/welcome-auth/WelcomeAuthScreen';

export enum LastRoutes {
  Business = 'Business',
  Favourite = 'Favourite',
}

interface Config {
  lastRoute: LastRoutes;
}

export const withAuthRedirection = (
  WrappedComponent: React.FC<any>,
  config: Config,
) => {
  return (props: any) => {
    const isLogin = useSelector((state: any) => state.auth.isLogin);
    if (!isLogin) {
      return <WelcomeAuthScreen lastRoute={config.lastRoute} {...props} />;
    }
    return <WrappedComponent {...props} />;
  };
};
