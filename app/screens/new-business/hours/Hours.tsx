import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, Button, HoursCheckbox, Icon } from '@components';
import { BaseStyle } from '@config';

import { styles } from '../styles/styles';
import { useBusiness } from '@screens/businesses/queries/queries';
import { OpenHours } from '@screens/businesses/models/BusinessPresentable';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import useAddBusinessStore from '../store/Store';
import { useEditBusiness } from '../queries/mutations';

export const Hours = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.id;

  const { mutate: updateTimings } = useEditBusiness(route?.params?.id);
  const { data: businessData } = useBusiness(route?.params?.id);

  const openHours = useAddBusinessStore((state: any) => state.openHours);
  const setOpenHours = useAddBusinessStore((state: any) => state.setOpenHours);

  const openHoursData = isEditBusiness ? businessData?.openHours : openHours;
  const [selectedDays, setSelectedDays] = useState<any>([]);

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
    if (openHoursData && openHoursData.length) {
      array = openHoursData
        .map((v: any) => ({ ...v, isOpen: true }))
        .concat(
          array.filter(
            ({ day }) => !openHoursData.find((f: any) => f.day === day),
          ),
        );
      setSelectedDays(array);
    } else {
      setSelectedDays(array);
    }
  }, [businessData, isEditBusiness, openHours, openHoursData]);

  const updateSelectedDays = (payload: OpenHours) => {
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

  const navigateToBack = () => {
    navigation.goBack();
  };

  const onSubmit = () => {
    let hours = selectedDays.filter((day: OpenHours) => day.isOpen);

    if (isEditBusiness) {
      updateTimings({ openHours: hours });
      navigation.navigate('EditBusiness', { id: route?.params?.id });
    } else {
      setOpenHours(hours);
      navigation.navigate('Price');
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Open Hours' : 'Opne Hours'}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={() => navigation.navigate('Price')}
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
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <FlatList
          style={styles.container}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          data={[1]}
          renderItem={() => {
            return (
              <View>
                <Text style={{ paddingBottom: 20 }} title1 bold>
                  Set Timings of your Business <Text body1>(optional)</Text>
                </Text>

                {selectedDays.map((item: OpenHours, index: number) => {
                  return (
                    <HoursCheckbox
                      key={index}
                      day={item}
                      getObject={updateSelectedDays}
                    />
                  );
                })}
              </View>
            );
          }}
        />

        <View
          style={
            isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter
          }>
          {isEditBusiness ? null : (
            <Button style={styles.footerButtons} onPress={navigateToBack}>
              {'Back'}
            </Button>
          )}

          <Button
            style={styles.footerButtons}
            title="submit"
            onPress={onSubmit}>
            {isEditBusiness ? 'Update Timings' : 'Next'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
