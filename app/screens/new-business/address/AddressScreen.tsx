import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { BaseColor, BaseStyle } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Text,
  Button,
} from '@components';

import { styles } from '../styles/styles';
import GlobalStyle from '../../../assets/styling/GlobalStyle';
import { Formik } from 'formik';
import { addressSFormValidation } from '../../AddBusiness/Validations';
import { ScrollView } from 'react-native-gesture-handler';
import { GlobalParamList } from 'navigation/models/GlobalParamList';
import { StackScreenProps } from '@react-navigation/stack';
import useAddBusinessStore from '../store/Store';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';

let defaultDelta = {
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};
const defaultLocation = {
  latitude: 25.0141904,
  longitude: 67.2725909,
};

export const AddressScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const mapRef = useRef();

  const address = useAddBusinessStore((state: any) => state.address);
  const setAddress = useAddBusinessStore((state: any) => state.setAddress);
  const setStoreLocation = useAddBusinessStore(
    (state: any) => state.setLocation,
  );

  const stateProps = useSelector(({ businesses }) => {
    return {
      editBusiness: businesses.editBusiness,
      editBusinessData: businesses.editBusinessData,
      businessFormData: businesses.businessFormData,
    };
  });

  const businessFormData = stateProps?.editBusiness
    ? stateProps?.editBusinessData
    : stateProps?.businessFormData;
  const onNext = () => {
    navigation.navigate('Hours');
  };

  useEffect(() => {
    let loc =
      businessFormData.location && businessFormData.location.coordinates
        ? businessFormData.location.coordinates
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
  }, [businessFormData.location, getUserLocation]);

  const [mapType, setMapType] = useState<string>('standard');
  const [location, setLocation] = useState<object>({
    ...defaultLocation,
    ...defaultDelta,
  });
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const [region, setRegion] = useState({
    ...defaultLocation,
    ...defaultDelta,
  });

  const reCenterMap = (currentLocation: NewAddBusinessPresentable) => {
    mapRef?.current?.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
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
      { enableHighAccuracy: true, timeout: 5000, interval: 100 },
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

  // satellite function and button start here
  const switchMapType = () => {
    setMapType(mapType === 'satellite' ? 'standard' : 'satellite');
  };
  const bottomButtons = () => {
    return (
      <View style={styles.mapFabButtonContainer}>
        <TouchableOpacity
          style={styles.mapFabButton}
          onPress={() => getUserLocation()}>
          <Icon name="location-arrow" style={styles.mapFabButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapFabButton}
          onPress={() => setFullScreen(!fullScreen)}>
          <Icon name="expand" style={styles.mapFabButtonIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const onDragEnd = (location: NewAddBusinessPresentable) => {
    setLocation(location);
    setRegion({ ...location, ...defaultDelta });
    reCenterMap({ ...location, ...defaultDelta });
    setLocation({ ...location, ...defaultDelta });

    const defaultMap = {
      type: 'Point',
      coordinates: [],
    };
    defaultMap.coordinates.push(location.latitude, location.longitude);
    setStoreLocation(defaultMap);
  };

  const submit = (values: NewAddBusinessPresentable) => {
    let payload = {
      ...values,
    };
    if (Object.keys(location).length) {
      payload.location = {
        type: 'Point',
        coordinates: [location.latitude, location.longitude],
      };
    }
    onNext();
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title={'Add Your Business'} />

      <Formik
        initialValues={{
          address: address,
        }}
        onSubmit={(values) => {
          navigation.navigate('Hours');
          console.log('What is Value of addess ?', values.address);
          setAddress(values.address);
        }}
        validationSchema={addressSFormValidation}>
        {({ handleChange, values, handleSubmit, errors, setFieldValue }) => {
          return (
            <Fragment>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ flex: 1 }}>
                <View style={[styles.mapContainer]}>
                  <View style={fullScreen ? styles.show : styles.hide}>
                    <View style={styles.title}>
                      <Text title3 semibold style={styles.titleCenter}>
                        Address
                      </Text>
                    </View>
                    <View style={GlobalStyle.inputContainer}>
                      <TextInput
                        style={styles.textArea}
                        placeholder="Address"
                        onChangeText={handleChange('address')}
                        value={values.address}
                        multiline={true}
                        // numberOfLines={10}
                        textAlignVertical="top"
                      />
                      {errors.address ? (
                        <Text style={GlobalStyle.errorText}>
                          {errors.address}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.container}>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      region={region}>
                      <MapView.Marker
                        coordinate={location}
                        title={'My current location'}
                        onDragEnd={(e: NewAddBusinessPresentable) =>
                          onDragEnd(e.nativeEvent.coordinate)
                        }
                        draggable
                      />
                    </MapView>
                    <View style={styles.bottomSection}>{bottomButtons()}</View>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.stickyFooter}>
                <Button
                  style={styles.footerButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.footerButtons,
                    !values.address
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {'Next'}
                </Button>
              </View>
            </Fragment>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
