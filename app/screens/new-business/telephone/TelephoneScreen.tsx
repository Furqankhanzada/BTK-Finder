import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { useBusiness } from '@screens/businesses/queries/queries';
import { styles } from '../styles/styles';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useEditBusiness } from '../queries/mutations';
import useAddBusinessStore from '../store/Store';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const phoneSchema = Yup.object({
  telephone: Yup.string()
    .min(11)
    .max(18)
    .matches(phoneRegExp, 'Valid Phone Number ex: 03001000100'),
});

export const TelephoneScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.id;

  const { mutate: editTelephone } = useEditBusiness(route?.params?.id);
  const { data: businessData } = useBusiness(route?.params?.id);

  const telephone = useAddBusinessStore((state: any) => state.telephone);
  const setTelephone = useAddBusinessStore((state: any) => state.setTelephone);

  const [addNumber, setAddNumber] = useState<Array<number>>([0]);

  const increment = () => {
    let addedNumber = [...addNumber];
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

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

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
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <Formik
          initialValues={{
            telephone: isEditBusiness ? businessData?.telephone : telephone,
          }}
          validationSchema={phoneSchema}
          onSubmit={(values) => {
            if (isEditBusiness) {
              editTelephone({ telephone: values.telephone });
              navigation.navigate('EditBusiness', { id: businessData?._id });
            } else {
              setTelephone(values.telephone);
              navigation.navigate('Email');
            }
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
                    <TouchableOpacity
                      style={styles.addMore}
                      onPress={increment}>
                      <Text style={styles.addMoreText}>Add more +</Text>
                    </TouchableOpacity>
                  }
                  renderItem={() => {
                    return (
                      <View>
                        <Text title1 bold>
                          What is the Telephone number of your Business ?{' '}
                          <Text body1>(optional)</Text>
                        </Text>
                        <View style={styles.phoneInputView}>
                          <TextInput
                            style={styles.phoneInput}
                            placeholder="Telephone number"
                            value={String(values.telephone)}
                            keyboardType="numeric"
                            onChangeText={handleChange('telephone')}
                          />
                          <View style={styles.phoneIconContainer}>
                            <Icon name="trash" size={20} onPress={decrement} />
                          </View>
                        </View>
                        <Text style={{ color: BaseColor.redColor }}>
                          {errors?.telephone?.toString()}
                        </Text>
                      </View>
                    );
                  }}
                />

                <View
                  style={
                    isEditBusiness
                      ? styles.stickyFooterEdit
                      : styles.stickyFooter
                  }>
                  {isEditBusiness ? null : (
                    <Button
                      style={styles.footerButtons}
                      onPress={navigateToBack}>
                      {'Back'}
                    </Button>
                  )}

                  <Button
                    style={[
                      styles.footerButtons,
                      errors?.telephone
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
