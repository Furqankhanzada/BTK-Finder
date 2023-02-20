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
      if (key === 'helplines') {
        setConfig({ ...config, helplines: JSON.parse(value._value) });
      }
      if (key === 'aboutUs') {
        setConfig({ ...config, about: JSON.parse(value._value) });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return config;
}
