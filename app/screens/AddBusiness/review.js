import React from 'react';
import { View } from 'react-native';
import {
  Header,
  SafeAreaView,
  Icon,
  CustomStepIndicator,
  PlaceDetailComponent,
} from '@components';
import ActionButton from 'react-native-action-button';

export default function FinalReview({ navigation }) {
  const onCofirm = () => {
    navigation.navigate('Home');
  };

  const data = {
    title: 'Burger King',
    category: 'Food',
    address: 'Precinct 10, Street 5, Shop no.15',
    tel: '+02133399677',
    email: 'btk@hotel.com',
    website: 'www.btkhotel.com',
    description:
      'Burger King Provides you to best quality burgers in whole bahria town, ' +
      'Try once and fall in love with our tasty burgers.',
    dateEstablished: '22 May 2020',
    priceFrom: '100',
    priceTo: '1500',
    preview: true,
    timings: [
      { day: 'Monday', from: '06:0 AM', to: '11:00 PM' },
      { day: 'Tuesday', from: '07:0 AM', to: '12:00 PM' },
      { day: 'Wednesday', from: '08:0 AM', to: '13:00 PM' },
      { day: 'Thursday', from: '09:0 AM', to: '14:00 PM' },
      { day: 'Friday', from: '10:0 AM', to: '15:00 PM' },
      { day: 'Saturday', from: 'Close' },
      { day: 'Sunday', from: 'Close' },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
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
        <CustomStepIndicator position={4} />
        <PlaceDetailComponent business={data} />
        <ActionButton
          buttonColor="rgba(93, 173, 226, 1)"
          onPress={() => onCofirm()}
          offsetX={20}
          offsetY={10}
          icon={<Icon name="check" size={20} color="white" enableRTL={true} />}
        />
      </SafeAreaView>
    </View>
  );
}
