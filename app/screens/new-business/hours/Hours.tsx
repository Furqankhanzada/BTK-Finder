import React, { useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, Button, HoursCheckbox, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';
import { useBusiness } from '@screens/businesses/queries/queries';

export const Hours = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { data: businessData } = useBusiness(route?.params?.id);
  const openHours = useAddBusinessStore((state: any) => state.openHours);
  const setOpenHours = useAddBusinessStore((state: any) => state.setOpenHours);
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

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
        onPressLeft={() => {
          navigation.navigate('EditBusiness', { id: businessData?._id });
        }}
      />

      <Formik
        initialValues={{
          hours: isEditBusiness ? businessData?.openHours : openHours,
        }}
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
                  style={[
                    styles.footerButtons,
                    !active ? { backgroundColor: BaseColor.grayColor } : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Address' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
