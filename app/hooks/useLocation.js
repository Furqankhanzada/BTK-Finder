import { useState, useEffect, useCallback } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { Linking } from 'react-native';

export default function useLocation() {
  const [coordinates, setCoordinates] = useState(null);
  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && position.coords) {
          setCoordinates(position.coords);
        }
      },
      (error) => {
        console.log('location error: ', error);
        let NO_LOCATION_PROVIDER_AVAILABLE = 2;
        if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
          getCurrentLocation();
        }
      },
      { enableHighAccuracy: true, timeout: 20000, interval: 10000 },
    );
  }, []);

  // Permission
  const requestAuthorizationForAndroid = useCallback(async () => {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'BTK App Location Permission',
        message: 'BTK App needs access to your Location ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  }, []);

  const askForPermission = useCallback(async () => {
    let permission;
    if (Platform.OS === 'android') {
      permission = await requestAuthorizationForAndroid();
    } else {
      permission = await Geolocation.requestAuthorization('whenInUse');
    }

    const message =
      'Without location you can not see near by results according to your current location';
    const buttons = [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ];
    switch (permission) {
      case PermissionsAndroid.RESULTS.GRANTED: // Should trigger for both android/ios
        return getCurrentLocation();
      case PermissionsAndroid.RESULTS.DENIED:
        Alert.alert('Permission Denied', message, buttons, {
          cancelable: false,
        });
        break;
      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        Alert.alert('Never Ask Again', message, buttons, {
          cancelable: false,
        });
        break;
      case 'disabled':
        Alert.alert('Location Disabled', message, buttons, {
          cancelable: false,
        });
        break;
      case 'restricted':
        Alert.alert('Location Restricted', message, buttons, {
          cancelable: false,
        });
        break;
    }
  }, [getCurrentLocation, requestAuthorizationForAndroid]);

  useEffect(() => {
    askForPermission().catch(console.log);
  }, [askForPermission]);

  return coordinates;
}
