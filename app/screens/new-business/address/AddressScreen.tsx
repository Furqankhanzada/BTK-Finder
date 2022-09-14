import React, { useRef, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { Header, Text, TextInput, Button } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const addressSchema = Yup.object({
  address: Yup.string().required('address atleast 10 words or more').min(10),
});

// let defaultDelta = {
//   latitudeDelta: 0.005,
//   longitudeDelta: 0.005,
// };
// const defaultLocation = {
//   latitude: 25.0141904,
//   longitude: 67.2725909,
// };

export const AddressScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  // const [mapType, setMapType] = useState<any>('standard');
  // const [location, setLocation] = useState<any>({
  //   ...defaultLocation,
  //   ...defaultDelta,
  // });
  // const [region, setRegion] = useState({
  //   ...defaultLocation,
  //   ...defaultDelta,
  // });
  // const mapRef = useRef();
  const navigateToBack = () => {
    navigation.goBack();
  };

  // const onDragEnd = (location: any) => {
  //   setLocation(location);
  //   setRegion({ ...location, ...defaultDelta });
  // };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Address" />

      <Formik
        initialValues={{ address: '' }}
        validationSchema={addressSchema}
        onSubmit={(values) => {
          navigation.navigate('Hours');
        }}>
        {({ values, handleChange, handleSubmit, errors }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={() => {
                  return (
                    <View>
                      <Text title1 bold>
                        What is your Business address ?
                      </Text>
                      <TextInput
                        style={styles.textArea}
                        placeholder="Business address ?"
                        value={values.address}
                        multiline={true}
                        textAlignVertical="top"
                        onChangeText={handleChange('address')}
                      />
                      <Text style={{ color: BaseColor.redColor }}>
                        {errors.address}
                      </Text>

                      {/* <MapView
                        ref={mapRef}
                        mapType={mapType}
                        provider={PROVIDER_GOOGLE}
                        region={region}>
                        <MapView.Marker
                          coordinate={location}
                          title={'My current location'}
                          onDragEnd={(e: any) =>
                            onDragEnd(e.nativeEvent.coordinate)
                          }
                          draggable
                        />
                      </MapView> */}
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button style={styles.fotterButtons} onPress={navigateToBack}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.fotterButtons,
                    values.address.length < 10
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
