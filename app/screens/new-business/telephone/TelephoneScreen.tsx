import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const phoneSchema = Yup.object({
  telephone: Yup.string()
    .min(11)
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(),
});

export const TelephoneScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Email');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Telephone Number" />
      <Formik
        initialValues={{ telephone: '' }}
        validationSchema={phoneSchema}
        onSubmit={(values) => {
          navigation.navigate('Email');
        }}>
        {({ values, handleChange, handleSubmit }) => {
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
                        What is the Telephone number of your Business ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="telephone"
                        value={values.telephone}
                        onChangeText={handleChange('telephone')}
                      />
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                {values.telephone?.length >= 3 ? (
                  <Button title="submit" onPress={handleSubmit}>
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
