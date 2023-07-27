import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text } from '@components';
import { BaseStyle } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';
import { OpenHours } from '@screens/businesses/models/BusinessPresentable';

import HoursCheckbox from './components/HoursCheckbox';
import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import ArrowBack from '../components/ArrowBack';

export default function OpenHoursScreen(
  props: StackScreenProps<NewBusinessParamList, 'OpenHours'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route.params?.businessId;

  const { mutate: updateTimings, isLoading } = useEditBusiness();
  const { data: businessData } = useBusiness(route.params?.businessId);

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
    }

    // Sort the array based on the day of the week
    const sortedArray = array.sort((a, b) => {
      const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      return days.indexOf(a.day) - days.indexOf(b.day);
    });

    setSelectedDays(sortedArray);
  }, [openHoursData]);

  useEffect(() => {
    if (isEditBusiness) {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        // Delay the reset to avoid flickering
        setTimeout(() => {
          setOpenHours([]);
        }, 300);
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const updateSelectedDays = (payload: OpenHours) => {
    setSelectedDays((prevSelectedDays) => {
      const updatedSelectedDays = prevSelectedDays.map((el) => {
        if (el.day === payload.day) {
          return {
            ...el,
            isOpen: payload.isOpen,
            to: payload.to || el.to,
            from: payload.from || el.from,
          };
        }
        return el;
      });

      const hours = updatedSelectedDays.filter((day: OpenHours) => day.isOpen);
      setOpenHours(hours);

      return updatedSelectedDays;
    });
  };

  const navigateToBack = () => {
    if (isEditBusiness) {
      navigation.goBack();
    }
  };

  const onSubmit = () => {
    let hours = selectedDays.filter((day: OpenHours) => day.isOpen);

    if (isEditBusiness) {
      updateTimings(
        {
          businessId: route.params.businessId,
          data: { openHours: hours },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setOpenHours(hours);
      navigation.navigate('Pricing');
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
        renderLeft={() => <ArrowBack show={!!isEditBusiness} />}
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <ScrollView style={styles.container}>
          <Text title1 bold style={styles.title}>
            What are the timings of your business? <Text body1>(optional)</Text>
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
        </ScrollView>

        <NavigationButtons
          onSubmit={onSubmit}
          loading={isLoading}
          disabled={isLoading}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
  title: {
    marginBottom: 15,
  },
});
