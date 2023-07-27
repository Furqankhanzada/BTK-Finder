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
    let updateConfig = {};

    for (const [key, value] of Object.entries(allValues)) {
      switch (key) {
        case 'helplines':
          updateConfig = {
            ...updateConfig,
            helplines: JSON.parse(value._value),
          };
          break;
        case 'facilities':
          updateConfig = {
            ...updateConfig,
            facilities: JSON.parse(value._value),
          };
          break;
        case 'tags':
          updateConfig = { ...updateConfig, tags: JSON.parse(value._value) };
          break;
        case 'aboutUs':
          updateConfig = { ...updateConfig, about: JSON.parse(value._value) };
          break;
        case 'ads':
          updateConfig = { ...updateConfig, ads: JSON.parse(value._value) };
          break;
      }
    }

    setConfig((prevConfig) => ({
      ...prevConfig,
      ...updateConfig,
    }));
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
