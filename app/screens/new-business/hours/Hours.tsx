import React, { useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, Button, HoursCheckbox } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

export const Hours = ({ navigation }: StackScreenProps<GlobalParamList>) => {
  const store = useAddBusinessStore((state: any) => state);

  const openHours = useAddBusinessStore((state: any) => state.openHours);
  const setOpenHours = useAddBusinessStore((state: any) => state.setOpenHours);

  console.log('UPDATED STORE IN OPEN HOURS SCREEN', store);

  const [active, setActive] = useState<boolean>(false);

  const updateSelectedDays = (payload: any) => {
    let array = [...openHours];
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
    setOpenHours(array);
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Opne Hours" />

      <Formik
        initialValues={{ hours: openHours }}
        onSubmit={(values) => {
          navigation.navigate('Price');
          setOpenHours(values.hours);
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

                      {openHours.map((day: any, index: any) => {
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
                <Button style={styles.footerButtons} onPress={navigateToBack}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.footerButtons,
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
