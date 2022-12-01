import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useBusiness } from '@screens/businesses/queries/queries';

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
  route,
}: StackScreenProps<GlobalParamList>) => {
  const [addNumber, setAddNumber] = useState<Array<number>>([0]);

  const { data: businessData } = useBusiness(route?.params?.id);
  const telephone = useAddBusinessStore((state: any) => state.telephone);
  const setTelephone = useAddBusinessStore((state: any) => state.setTelephone);
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  const increment = (index: number) => {
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
        title={isEditBusiness ? 'Update Number' : 'Telephone Number'}
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
          navigation.goBack();
        }}
      />
      <Text title1 bold style={styles.textPadding}>
        What is the Telephone number of your Business ?
      </Text>
      <Formik
        initialValues={{
          telephone: isEditBusiness ? businessData?.telephone : telephone,
        }}
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
                          value={String(values.telephone)}
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
                      {/* <Text style={{ color: BaseColor.redColor }}>
                        {errors.telephone}
                      </Text> */}
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
                    values.telephone.length < 11 || values.telephone.length > 18
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Phone Number' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
