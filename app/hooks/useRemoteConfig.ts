import { useEffect, useState } from 'react';

import remoteConfig from '@react-native-firebase/remote-config';
import { handleError } from '@utils';

import { RemoteConfig } from '../models/RemoteConfig';

export default function useRemoteConfig(): RemoteConfig {
  const [facilities, setFacilities] = useState([]);
  const [tags, setTags] = useState([]);
  const [helplines, setHelplines] = useState([]);

  const config: RemoteConfig = {
    facilities: facilities,
    tags: tags,
    helplines: helplines,
  };

  const updateStates = () => {
    const allValues: Record<string, any> = remoteConfig().getAll();
    for (const [key, value] of Object.entries(allValues)) {
      if (key === 'facilities') {
        setFacilities(JSON.parse(value._value));
      }
      if (key === 'tags') {
        setTags(JSON.parse(value._value));
      }
      if (key === 'helplines') {
        setHelplines(JSON.parse(value._value));
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
