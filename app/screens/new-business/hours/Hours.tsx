import React, { useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, Button, HoursCheckbox } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

export const Hours = ({ navigation }: StackScreenProps<GlobalParamList>) => {
  let array = [
    { day: 'Monday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Tuesday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Wednesday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Thursday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Friday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Saturday', from: '09:00 am', to: '10:00 pm', isOpen: false },
    { day: 'Sunday', from: '09:00 am', to: '10:00 pm', isOpen: false },
  ];

  const [selectedDays, setSelectedDays] = useState(array);
  const [active, setActive] = useState<boolean>(false);

  const updateSelectedDays = (payload: any) => {
    let array = [...selectedDays];
    array.map((el) => {
      if (el.day === payload.day) {
        el.isOpen = payload.isOpen;
        setActive(true);
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

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Opne Hours" />

      <Formik
        initialValues={{ hours: '' }}
        onSubmit={(values) => {
          navigation.navigate('Price');
        }}>
        {({ values, handleSubmit }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={(item) => {
                  return (
                    <View>
                      <Text style={{ paddingBottom: 20 }} title1 bold>
                        Set Timings of your Business
                      </Text>

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
                    !active ? { backgroundColor: BaseColor.grayColor } : null,
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
