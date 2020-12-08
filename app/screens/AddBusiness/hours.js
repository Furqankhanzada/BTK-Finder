import React from 'react';
import { View, Platform } from 'react-native';
import { BaseStyle } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  CustomStepIndicator,
  HoursCheckbox,
} from '@components';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';

export default function Hours({ navigation }) {
  
  const onNext = () => {
    navigation.navigate('PriceRange');
  };

  const days = [
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
    { day: 'Saturday' },
    { day: 'Sunday' },
  ];

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
      <CustomStepIndicator position={2} />
      <ScrollView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1, marginTop: 20 }}>
        <View style={{ padding: 20, flex: 1 }}>
          <View style={styles.title}>
            <Text title3 semibold style={{ textAlign: 'center' }}>
              Hours
            </Text>
          </View>
          {days.map((item) => {
            return <HoursCheckbox hours={item} />;
          })}
        </View>
      </ScrollView>
      <ActionButton
        buttonColor="rgba(93, 173, 226, 1)"
        onPress={() => onNext()}
        offsetX={20}
        offsetY={10}
        icon={
          <Icon name="arrow-right" size={20} color="white" enableRTL={true} />
        }
      />
    </SafeAreaView>
  );
}
