import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, HoursCheckbox, Icon } from '@components';
import { BaseStyle } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';
import { OpenHours } from '@screens/businesses/models/BusinessPresentable';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';

export const OpenHoursScreen = (
  props: StackScreenProps<NewBusinessParamList, 'OpenHours'>,
) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { mutate: updateTimings } = useEditBusiness(
    route?.params?.businessId ?? '',
  );
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');

  const openHours = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.openHours,
  );
  const setOpenHours = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setOpenHours,
  );

  const openHoursData = isEditBusiness ? businessData?.openHours : openHours;
  const [selectedDays, setSelectedDays] = useState<OpenHours[]>([]);

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
      const hoursWithIsOpen = openHoursData.map((day: OpenHours) => ({
        ...day,
        isOpen: true,
      }));
      array = hoursWithIsOpen
        .map((v: OpenHours) => ({ ...v, isOpen: true }))
        .concat(
          array.filter(
            ({ day }) => !hoursWithIsOpen.find((f: OpenHours) => f.day === day),
          ),
        );
      setSelectedDays(array);
    } else {
      setSelectedDays(array);
    }
  }, [openHoursData]);

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
      navigation.goBack();
    } else {
      setOpenHours(hours);
      // navigation.navigate('Price');
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
        <FlatList
          style={styles.container}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          data={[1]}
          renderItem={() => {
            return (
              <View>
                <Text title1 bold>
                  What are the timings of your business?{' '}
                  <Text body1>(optional)</Text>
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

        <NavigationButtons onSubmit={onSubmit} isEdit={!!isEditBusiness} />
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
  input: {
    marginTop: 15,
  },
});
