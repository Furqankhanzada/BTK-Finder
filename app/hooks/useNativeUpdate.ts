import * as React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import SpInAppUpdates, {
  InstallationResult,
  StatusUpdateEvent,
} from 'sp-react-native-in-app-updates';
import Storefront from 'react-native-store-front';
import Config from 'react-native-config';

import { AndroidInstallStatus, AndroidUpdateType } from './types';
import { LocalStorageKeys } from '../services/storage/models/LocalStorageKey';
import { ISO3166Alpha3, iso3166Alpha3CountryCodeToAlpha2 } from '@utils';
import useLocalStorage from './useLocalStorage';

export default function useNativeUpdate() {
  const { setItem, getItem } = useLocalStorage();

  const storeVersion = React.useRef<string | null>(null);

  const alertShownForCurrentSession = React.useRef<boolean>(false);

  const checkIfUpdateSkipped = React.useCallback(
    async (version: string) => {
      try {
        const skippedVersion = await getItem(
          LocalStorageKeys.NATIVE_UPDATE_VERSION,
        );
        return skippedVersion === version;
      } catch {
        return false;
      }
    },
    [getItem],
  );

  const handleAndroid = React.useCallback(async () => {
    const androidStatusUpdateListener = (event: StatusUpdateEvent) => {
      if (event.status === AndroidInstallStatus.DOWNLOADED) {
        inAppUpdates.installUpdate();
      }
    };

    const androidIntentSelectionListener = async (
      event: InstallationResult,
    ) => {
      // @ts-expect-error type should be a string instead of a number
      if (event === AndroidInstallStatus.CANCELED && storeVersion.current) {
        await setItem(
          LocalStorageKeys.NATIVE_UPDATE_VERSION,
          storeVersion.current,
        );
        storeVersion.current = null;
      }
    };

    const inAppUpdates = new SpInAppUpdates(false);
    inAppUpdates.addStatusUpdateListener(androidStatusUpdateListener);
    inAppUpdates.addIntentSelectionListener(androidIntentSelectionListener);

    try {
      const result = await inAppUpdates.checkNeedsUpdate();
      const shouldSkip = await checkIfUpdateSkipped(result.storeVersion);
      if (shouldSkip) {
        // eslint-disable-next-line no-console
        console.log('[useNativeUpdate]: App update skipped by user');
        return;
      }

      storeVersion.current = result.storeVersion;

      if (result.shouldUpdate) {
        inAppUpdates.startUpdate({
          updateType: AndroidUpdateType.FLEXIBLE,
        });
      }
    } catch {}

    return () => {
      inAppUpdates.removeStatusUpdateListener(androidStatusUpdateListener);
      inAppUpdates.removeIntentSelectionListener(
        androidIntentSelectionListener,
      );
    };
  }, [checkIfUpdateSkipped, setItem]);

  const handleIOS = React.useCallback(async () => {
    if (alertShownForCurrentSession.current) return;

    try {
      const inAppUpdates = new SpInAppUpdates(false);

      const alpha3CountryCode =
        (await Storefront.getStoreFront()) as ISO3166Alpha3;
      if (!alpha3CountryCode) return;

      const alpha2CountryCode =
        iso3166Alpha3CountryCodeToAlpha2[alpha3CountryCode];
      if (!alpha2CountryCode) return;

      const result = await inAppUpdates.checkNeedsUpdate({
        country: alpha2CountryCode,
      });
      const shouldSkip = await checkIfUpdateSkipped(result.storeVersion);
      if (shouldSkip) {
        // eslint-disable-next-line no-console
        console.log('[useNativeUpdate]: App update skipped by user');
        return;
      }

      if (result.shouldUpdate) {
        // openedAppStore does not mean the user actually updated from the app store
        // the user may press 'confirm' and then return to the app without updating.
        Alert.alert(
          'Update Required',
          'Your application version is outdated, Click on Update Now to update it.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Update Now',
              onPress: () => Linking.openURL(Config.DYNAMIC_LINK_URL),
            },
          ],
          {
            cancelable: false,
          },
        );

        // we will skip showing any popup for the current session
        alertShownForCurrentSession.current = true;
      } else {
        // we will skip showing the popup again for this new version
        await setItem(
          LocalStorageKeys.NATIVE_UPDATE_VERSION,
          result.storeVersion,
        );
      }
    } catch {}
  }, [checkIfUpdateSkipped, setItem]);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      handleAndroid();
    } else {
      handleIOS();
    }
  }, [handleAndroid, handleIOS]);
}
