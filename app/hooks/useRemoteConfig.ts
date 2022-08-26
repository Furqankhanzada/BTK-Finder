import { useEffect, useState } from 'react';

import remoteConfig from '@react-native-firebase/remote-config';
import { handleError } from '@utils';

import { RemoteConfig } from '../models/RemoteConfig';

export default function useRemoteConfig(): RemoteConfig {
  const [config, setConfig] = useState<RemoteConfig>({
    helplines: [],
  });
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
        .then((fetchedRemotely) => {
          if (fetchedRemotely) {
            console.log(
              'Configs were retrieved from the backend and activated.',
            );
            const allValues: Record<string, any> = remoteConfig().getAll();
            for (const [key, value] of Object.entries(allValues)) {
              console.log('key, value###', key, value);
              if (key === 'helplines') {
                setConfig({ ...config, helplines: JSON.parse(value._value) });
              }
            }
          } else {
            console.log(
              'No configs were fetched from the backend, and the local configs were already activated',
            );
          }
        });
    }
    fetchAndActivate().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return config;
}
