import { useEffect, useState } from 'react';

import remoteConfig from '@react-native-firebase/remote-config';
import { handleError } from '@utils';

import { RemoteConfig } from '../models/RemoteConfig';

export default function useRemoteConfig(): RemoteConfig {
  const [config, setConfig] = useState<RemoteConfig>({
    helplines: [],
  });

  const updateStates = () => {
    const allValues: Record<string, any> = remoteConfig().getAll();
    for (const [key, value] of Object.entries(allValues)) {
      switch (key) {
        case 'helplines':
          setConfig((prevConfig) => ({
            ...prevConfig,
            helplines: JSON.parse(value._value),
          }));
          break;
        case 'facilities':
          setConfig((prevConfig) => ({
            ...prevConfig,
            facilities: JSON.parse(value._value),
          }));
          break;
        case 'tags':
          setConfig((prevConfig) => ({
            ...prevConfig,
            tags: JSON.parse(value._value),
          }));
          break;
        case 'aboutUs':
          setConfig((prevConfig) => ({
            ...prevConfig,
            about: JSON.parse(value._value),
          }));
          break;
        case 'ads':
          setConfig((prevConfig) => ({
            ...prevConfig,
            ads: JSON.parse(value._value),
          }));
          break;
      }
    }
  };

  useEffect(() => {
    async function fetchAndActivate() {
      // Only for development
      // if (__DEV__) {
      //   await remoteConfig().setConfigSettings({
      //     minimumFetchIntervalMillis: 0,
      //   });
      // }
      remoteConfig()
        .fetchAndActivate()
        .then(() => {
          updateStates();
        });
    }
    fetchAndActivate().catch(handleError);
  }, []);

  return config;
}
