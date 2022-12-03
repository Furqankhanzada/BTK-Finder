import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Header, Text, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import GlobalStyle from '../../../assets/styling/GlobalStyle';
import moment from 'moment';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';
import { useBusiness } from '@screens/businesses/queries/queries';

export const EstablishedScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Address');
  };

  const { data: businessData } = useBusiness(route?.params?.id);
  const established = useAddBusinessStore((state: any) => state.established);
  const setEstablished = useAddBusinessStore(
    (state: any) => state.setEstablished,
  );
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  console.log('Business ?', businessData?.established);

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleConfirm = (
    date: NewAddBusinessPresentable,
    setFieldValue: NewAddBusinessPresentable,
  ) => {
    setFieldValue('established', date);
    toggleDatePicker();
    setActive(true);
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const { colors } = useTheme();
  const cardColor = colors.card;

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Established Date' : 'Established Date '}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
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
          established: isEditBusiness ? businessData?.established : established,
        }}
        onSubmit={(values) => {
          navigation.navigate('Address');
          setEstablished(moment(values.established).format('DD/MM/YYYY'));
          console.log(
            'What is Established ?',
            moment(values.established).format('DD/MM/YYYY'),
          );
        }}>
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={() => {
                  return (
                    <View>
                      <Text title1 bold>
                        When you have established your Business in BTK?
                      </Text>
                      <View style={GlobalStyle.inputContainer}>
                        <TouchableOpacity
                          onPress={() => toggleDatePicker()}
                          style={[
                            GlobalStyle.datePickerContainer,
                            { backgroundColor: cardColor },
                          ]}>
                          <Text>
                            {values.established
                              ? moment(values.established).format('DD/MM/YYYY')
                              : 'Established Date [YYYY/MM/DD]'}
                          </Text>
                          <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(date) =>
                              handleConfirm(date, setFieldValue)
                            }
                            onCancel={toggleDatePicker}
                          />
                        </TouchableOpacity>
                      </View>
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
                  onPress={() => navigateToNext()}>
                  {isEditBusiness ? 'Update Category' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
