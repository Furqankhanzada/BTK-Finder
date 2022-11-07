import React, { useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, Button, HoursCheckbox } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';

export const Hours = ({ navigation }: StackScreenProps<GlobalParamList>) => {
  const openHours = useAddBusinessStore((state: any) => state.openHours);
  const setOpenHours = useAddBusinessStore((state: any) => state.setOpenHours);

  const [active, setActive] = useState<boolean>(false);

  const updateSelectedDays = (payload: NewAddBusinessPresentable) => {
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
  };

  const selectedHours = () => {
    let newArray = openHours.filter(
      (obj: NewAddBusinessPresentable) => obj.isOpen,
    );
    setOpenHours(newArray);
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
          selectedHours();
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

                      {openHours.map(
                        (day: NewAddBusinessPresentable, index: number) => {
                          return (
                            <HoursCheckbox
                              key={index}
                              day={day}
                              getObject={updateSelectedDays}
                            />
                          );
                        },
                      )}
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
