import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { BaseStyle } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Text,
  CustomStepIndicator,
} from '@components';
import styles from './styles';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';

export default function Address({ navigation }) {

  const onNext = () => {
    navigation.navigate('Hours');
  };

  const [region, setRegion] = useState({
    latitude: 24.993723,
    longitude: 67.317047,
    latitudeDelta: 0.010,
    longitudeDelta: 0.005,
  });
  const [street, setStreet] = useState('');

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
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
      <ScrollView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.contain}>
          <View style={styles.title}>
            <Text title3 semibold>
              Address
            </Text>
          </View>
          <View>
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={(text) => setStreet(text)}
              placeholder="Address"
              value={street}
            />
            {/* <TextInput
              style={{ marginTop: 10 }}
              onChangeText={(text) => setRegion.latitude(text)}
              placeholder="Google Map Latitude"
              value={region.latitude}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={(text) => setRegion.longitude(text)}
              placeholder="Google Map Longitude"
              value={region.longitude}
            />
            <View
              style={{
                height: 180,
                paddingVertical: 20,
                marginTop: 20,
              }}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChange={() => {}}>
                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                />
              </MapView>
            </View> */}
          </View>
        </View>
      </ScrollView>
      <ActionButton
        buttonColor="rgba(93, 173, 226, 1)"
        onPress={() => onNext()}
        offsetX={20}
        offsetY={10}
        icon={
          <Icon
          name="arrow-right"
          size={20}
          color="white"
          enableRTL={true} />
        }
      />
    </SafeAreaView>
  );
}