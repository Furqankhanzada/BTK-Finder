import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Header, Text, Button, TextInput } from '@components';
import { BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import GlobalStyle from '../../../assets/styling/GlobalStyle';
import moment from 'moment';

export const EstablishedScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Address');
  };

  const established = useAddBusinessStore((state: any) => state.established);
  const setEstablished = useAddBusinessStore(
    (state: any) => state.setEstablished,
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [active, setActive] = useState<boolean>(false);

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleConfirm = (date: any, setFieldValue: any) => {
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
        title="Bhsiness Established"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{ established: established }}
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
              <View style={styles.stickyFooter}>
                <Button
                  style={styles.footerButtons}
                  onPress={() => {
                    navigateToBack();
                  }}>
                  {'Back'}
                </Button>
                {active === true ? (
                  <Button onPress={handleSubmit} style={styles.footerButtons}>
                    {'Next'}
                  </Button>
                ) : null}
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
