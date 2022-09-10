import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const emailSchema = Yup.object({
  email: Yup.string().email(),
});

export const EmailScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Email Address" />
      <Formik
        initialValues={{ email: '' }}
        validationSchema={emailSchema}
        onSubmit={(values) => {
          navigation.navigate('Website');
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
                        What is the valid Email address of your Business ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                      />
                    </View>
                  );
                }}
              />
              {values.email?.length >= 3 ? (
                <View style={styles.stickyFooter}>
                  <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                  <Button title="submit" onPress={handleSubmit}>
                    {'Next'}
                  </Button>
                </View>
              ) : null}
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
