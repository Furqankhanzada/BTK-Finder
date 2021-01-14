import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import ActionButton from 'react-native-action-button';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  CustomStepIndicator,
  HoursCheckbox,
} from '@components';
import styles from './styles';
import {
  setBusinessFormData,
  updateEditBusinessData,
} from '../../actions/business';

export default function Hours({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
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

  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    let array = [
      { day: 'Monday', from: '09:00 am', to: '05:00 pm', isOpen: false },
      { day: 'Tuesday', from: '09:00 am', to: '05:00 pm', isOpen: false },
      { day: 'Wednesday', from: '09:00 am', to: '05:00 pm', isOpen: false },
      { day: 'Thursday', from: '09:00 am', to: '05:00 pm', isOpen: false },
      { day: 'Friday', from: '09:00 am', to: '05:00 pm', isOpen: false },
      { day: 'Saturday', from: '09:00 am', to: '05:00 pm', isOpen: false },
      { day: 'Sunday', from: '09:00 am', to: '05:00 pm', isOpen: false },
    ];
    if (businessFormData.openHours && businessFormData.openHours.length) {
      array = businessFormData.openHours
        .map((v) => ({ ...v, isOpen: true }))
        .concat(
          array.filter(
            ({ day }) => !businessFormData.openHours.find((f) => f.day === day),
          ),
        );
      setSelectedDays(array);
    } else {
      setSelectedDays(array);
    }
  }, [businessFormData.openHours]);

  const onNext = () => {
    let payload = {};
    if (selectedDays && selectedDays.length) {
      payload.openHours = selectedDays.filter((obj) => obj.isOpen);
    }
    if (stateProps.editBusiness) {
      dispatch(updateEditBusinessData(payload));
    } else {
      dispatch(setBusinessFormData(payload));
    }
    navigation.navigate('PriceRange');
  };

  const updateSelectedDays = (payload) => {
    let array = [...selectedDays];
    array.map((el) => {
      if (el.day === payload.day) {
        el.isOpen = payload.isOpen;
        if (payload.to) {
          el.to = payload.to;
        }
        if (payload.from) {
          el.from = payload.from;
        }
      }
    });
    setSelectedDays(array);
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={
          stateProps?.editBusiness ? 'Edit Your Business' : 'Add Your Business'
        }
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
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View style={{ padding: 20, flex: 1 }}>
          <View style={styles.title}>
            <Text title3 semibold style={{ textAlign: 'center' }}>
              Hours
            </Text>
          </View>
          {selectedDays.map((day, index) => {
            return (
              <HoursCheckbox
                key={index}
                day={day}
                getObject={updateSelectedDays}
              />
            );
          })}
        </View>
      </ScrollView>
      <ActionButton
        buttonColor={colors.primary}
        nativeFeedbackRippleColor="transparent"
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
