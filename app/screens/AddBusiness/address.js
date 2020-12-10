import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
    View,
    Platform,
    TouchableOpacity,
    PermissionsAndroid,
} from 'react-native';
import { BaseStyle } from '@config';
import {
    Header,
    SafeAreaView,
    Icon,
    TextInput,
    Text,
    CustomStepIndicator
} from '@components';
import styles from './styles';
import ActionButton from 'react-native-action-button';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Formik } from 'formik';
import { addressSFormValidation  } from './Validations';
import GlobalStyle from "../../assets/styling/GlobalStyle";
import {useDispatch, useSelector} from "react-redux";
import {setBusinessFormData} from "../../actions/business";

let defaultDelta = {
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
};
const defaultLocation = {
    latitude: 25.0141904,
    longitude: 67.2725909,
};

export default function Address({ navigation }) {
    const mapRef = useRef();
    const formRef = useRef();
    const dispatch = useDispatch();
    const businesses = useSelector(({businesses}) => businesses);
    const { businessFormData } = businesses;

    const onNext = () => {
        navigation.navigate('Hours');
    };

    useEffect(() => {
        let loc =  businessFormData.location && businessFormData.location.coordinates ? businessFormData.location.coordinates : null
        if(loc){
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
    }, []);

    const [mapType, setMapType] = useState('standard');
    const [location, setLocation] = useState({
        ...defaultLocation,
        ...defaultDelta
    });
    const [region, setRegion] = useState({
        ...defaultLocation,
        ...defaultDelta
    });

    const reCenterMap = (currentLocation) => {
        mapRef.current.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: defaultDelta.latitudeDelta,
            longitudeDelta: defaultDelta.longitudeDelta,
        });
    };

    const getCurrentLocation = () => {
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
    };
    const requestLocationPermissionForAndroid = async () => {
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
    };
    const getUserLocation = async () => {
        if (Platform.OS === 'android') {
            await requestLocationPermissionForAndroid();
        } else {
            getCurrentLocation();
        }
    };

    // satellite function and button start here
    const switchMapType = () => {
        setMapType(mapType === 'satellite' ? 'standard' : 'satellite');
    };
    const bottomButtons = () => {
        return (
            <View style={styles.mapFabButtonContainer}>
                <TouchableOpacity
                    style={[
                        styles.mapFabButton,
                        mapType === 'satellite' && styles.activeMapFabButton,
                    ]}
                    onPress={() => switchMapType()}>
                    <Icon
                        name="globe"
                        style={[
                            styles.mapFabButtonIcon,
                            mapType === 'satellite' && styles.activeMapFabButtonIcon,
                        ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.mapFabButton}
                    onPress={() => getUserLocation()}>
                    <Icon name="location-arrow" style={styles.mapFabButtonIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    const onDragEnd = (location) => {
        setLocation(location);
        setRegion({...location, ...defaultDelta});
        reCenterMap({...location, ...defaultDelta})
    }

    const submit = (values) => {
        let payload = {
            ...values
        };
        if(Object.keys(location).length){
            payload.location = {
                type: "Point",
                coordinates: [
                    location.latitude,
                    location.longitude,
                ]
            }
        }
        dispatch(setBusinessFormData(payload))
        onNext()
    }

    return (
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
            <Header
                title={'Add Your Business'}
                renderLeft={() => {
                    return (
                        <Icon
                            name="arrow-left"
                            size={20}
                            color="#5dade2"
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <CustomStepIndicator position={1} />
            <Formik
                ref={formRef}
                onSubmit={(values) => submit(values)}
                initialValues={{
                    address: businessFormData.address ? businessFormData.address : ''
                }}
                validationSchema={addressSFormValidation}>
                {({ handleChange, values, handleSubmit, errors, setFieldValue }) => {
                    return (
                        <Fragment>
                            <View style={[styles.mapContainer]}>
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
                                        numberOfLines={10}
                                        textAlignVertical="top"
                                    />
                                    {errors.address ? (
                                        <Text style={GlobalStyle.errorText}>{errors.address}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.container}>
                                    <MapView
                                        ref={mapRef}
                                        mapType={mapType}
                                        provider={PROVIDER_GOOGLE}
                                        style={styles.map}
                                        region={region}
                                    >
                                    <MapView.Marker
                                        coordinate={location}
                                        title={'My current location'}
                                        onDragEnd={(e) => onDragEnd(e.nativeEvent.coordinate)}
                                        draggable
                                    />
                                    </MapView>
                                    <View style={styles.bottomSection}>{bottomButtons()}</View>
                                </View>
                            </View>

                            <ActionButton
                                buttonColor="rgba(93, 173, 226, 1)"
                                onPress={() => handleSubmit()}
                                offsetX={20}
                                offsetY={10}
                                icon={
                                    <Icon
                                        name="arrow-right"
                                        size={20}
                                        color="white"
                                        enableRTL={true}
                                    />
                                }
                            />
                        </Fragment>
                    );
                }}
            </Formik>
        </SafeAreaView>
    );
}
