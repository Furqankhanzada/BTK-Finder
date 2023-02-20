import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StackScreenProps } from '@react-navigation/stack';
import { Controller, useForm } from 'react-hook-form';

import { Header, SafeAreaView, Icon, TextInput, Text } from '@components';
import { BaseColor, BaseStyle } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';

import { NavigationButtons } from '../components/NavigationButtons';
import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { Location } from '@screens/businesses/models/BusinessPresentable';

interface LocationDataType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const defaultDelta = {
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const defaultLocation = {
  latitude: 25.0141904,
  longitude: 67.2725909,
};

export const AddressScreen = (
  props: StackScreenProps<NewBusinessParamList, 'Address'>,
) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;
  const mapRef = useRef<MapView>();

  const { mutate: editAddress } = useEditBusiness(
    route?.params?.businessId ?? '',
  );
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessStoreTypes>({
    defaultValues: {
      address: isEditBusiness ? businessData?.address : '',
    },
  });

  const setAddress = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setAddress,
  );
  const setStoreLocation = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setLocation,
  );

  const [location, setLocation] = useState<LocationDataType>({
    ...defaultLocation,
    ...defaultDelta,
  });
  const [region, setRegion] = useState<LocationDataType>({
    ...defaultLocation,
    ...defaultDelta,
  });

  const reCenterMap = (currentLocation: {
    latitude: number;
    longitude: number;
  }) => {
    mapRef?.current?.animateToRegion({
      latitude: currentLocation.latitude ?? defaultLocation.latitude,
      longitude: currentLocation.longitude ?? defaultLocation.longitude,
      latitudeDelta: defaultDelta.latitudeDelta,
      longitudeDelta: defaultDelta.longitudeDelta,
    });
  };

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position && position.coords) {
          const { latitude, longitude } = position.coords;
          const payload = {
            latitude,
            longitude,
            ...defaultDelta,
          };
          setLocation(payload);
          setRegion(payload);
          reCenterMap(payload);
        }
      },
      (error) => {
        let NO_LOCATION_PROVIDER_AVAILABLE = 2;
        if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
          getCurrentLocation();
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
    );
  }, []);

  const requestLocationPermissionForAndroid = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'BTK App Location Permission',
          message: 'BTK App needs access to your Location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        if (Platform.OS === 'android') {
          getCurrentLocation();
        }
      }
    } catch (err) {
      console.log('warn', 'An error accourd while enabling location');
    }
  }, [getCurrentLocation]);

  const getUserLocation = useCallback(async () => {
    if (Platform.OS === 'android') {
      await requestLocationPermissionForAndroid();
    } else {
      await Geolocation.requestAuthorization('whenInUse');
      getCurrentLocation();
    }
  }, [getCurrentLocation, requestLocationPermissionForAndroid]);

  useEffect(() => {
    let loc =
      businessData?.location && businessData?.location.coordinates
        ? businessData?.location.coordinates
        : null;
    if (loc) {
      const payload = {
        latitude: loc[0],
        longitude: loc[1],
        ...defaultDelta,
      };
      setLocation(payload);
      setRegion(payload);
      reCenterMap(payload);
    } else {
      getUserLocation();
    }
  }, [businessData?.location, getUserLocation]);

  const onDragEnd = (markerLocation: {
    latitude: number;
    longitude: number;
  }) => {
    setRegion({ ...markerLocation, ...defaultDelta });
    reCenterMap({ ...markerLocation, ...defaultDelta });
    setLocation({ ...markerLocation, ...defaultDelta });

    const defaultMap: Location = {
      type: 'Point',
      coordinates: [],
    };
    defaultMap.coordinates.push(
      markerLocation.latitude,
      markerLocation.longitude,
    );
    setStoreLocation(defaultMap);
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const onSubmit = async (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editAddress({
        address: data.address,
        location: {
          type: 'Point',
          coordinates: [
            location?.latitude ?? defaultLocation.latitude,
            location.longitude ?? defaultLocation.longitude,
          ],
        },
      });
      navigation.goBack();
    } else {
      setStoreLocation({
        type: 'Point',
        coordinates: [location?.latitude, location?.longitude],
      });
      setAddress(data.address);
      // navigation.navigate('Hours');
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Business Address' : 'Business Address'}
        renderLeft={() => {
          return isEditBusiness ? (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          ) : null;
        }}
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainerStyle}
            style={styles.scrollView}>
            <Text title1 bold>
              Address
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textArea}
                  placeholder="Address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  success={!errors.address}
                  multiline={true}
                  textAlignVertical="top"
                />
              )}
              name="address"
            />
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}>
                <Marker
                  coordinate={location}
                  title={'My current location'}
                  onDragEnd={(event: MapEvent) =>
                    onDragEnd(event.nativeEvent.coordinate)
                  }
                  draggable
                />
              </MapView>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => getUserLocation()}>
                <Icon name="location-arrow" style={styles.locationButtonIcon} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <NavigationButtons
          onSubmit={handleSubmit(onSubmit)}
          disabled={!!errors.address}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
  scrollViewContainerStyle: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  textArea: {
    height: 80,
    padding: 10,
    marginTop: 15,
  },
  mapContainer: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColor.whiteColor,
    shadowColor: BaseColor.kashmir,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  locationButtonIcon: {
    fontSize: 22,
    color: BaseColor.blueColor,
  },
});
