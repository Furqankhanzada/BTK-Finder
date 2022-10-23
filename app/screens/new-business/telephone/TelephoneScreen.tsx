import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const phoneSchema = Yup.object({
  telephone: Yup.string()
    .min(11)
    .max(18)
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Valid Phone Number ex: 03001000100'),
});

export const TelephoneScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [addNumber, setAddNumber] = useState([0]);

  // const store = useAddBusinessStore((state: any) => state);
  const telephone = useAddBusinessStore((state: any) => state.telephone);
  const setTelephone = useAddBusinessStore((state: any) => state.setTelephone);

  // console.log('UPDATED STORE IN TELEPHONE SCREEN', store);

  const increment = (index: any) => {
    let addedNumber = [...addNumber];
    let newArr = addedNumber.map((one) => {
      return console.log('ONE', one);
    });
    // if (addedNumber.length < 3) {
    //   addedNumber.length++;
    // }
    setAddNumber(addedNumber);
  };
  const decrement = () => {
    let addedNumber = [...addNumber];
    if (addedNumber.length > 1) {
      addedNumber.length--;
    }
    setAddNumber(addedNumber);
  };

  const navigateToNext = () => {
    navigation.navigate('Email');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Telephone Number"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Text title1 bold style={styles.textPadding}>
        What is the Telephone number of your Business ?
      </Text>
      <Formik
        initialValues={{ telephone: telephone }}
        validationSchema={phoneSchema}
        onSubmit={(values) => {
          navigation.navigate('Email');
          setTelephone(values.telephone);
        }}>
        {({ values, handleChange, handleSubmit, errors }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={addNumber}
                ListFooterComponent={
                  <TouchableOpacity style={styles.addMore} onPress={increment}>
                    <Text style={styles.addMoreText}>Add more +</Text>
                  </TouchableOpacity>
                }
                renderItem={(index) => {
                  return (
                    <View>
                      <View style={styles.phoneInputView}>
                        <TextInput
                          key={index.index}
                          style={styles.phoneInput}
                          placeholder="Telephone number"
                          value={values.telephone}
                          keyboardType="numeric"
                          onChangeText={handleChange('telephone')}
                        />
                        <Icon
                          name="trash"
                          size={21}
                          style={styles.phoneIcon}
                          onPress={decrement}
                        />
                      </View>
                      <Text style={{ color: BaseColor.redColor }}>
                        {errors.telephone}
                      </Text>
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button
                  style={styles.footerButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.footerButtons,
                    values.telephone.length < 11 || values.telephone.length > 18
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
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
