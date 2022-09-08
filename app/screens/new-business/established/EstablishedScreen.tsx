import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';

export const EstablishedScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  // const navigateToNext = () => {
  //   navigation.navigate('');
  // };

  const navigateToBack = () => {
    navigation.navigate('Website');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Bhsiness Established" />
      <Formik
        initialValues={{ establish: '' }}
        onSubmit={(values) => {
          console.log('Formik Values', values);
        }}>
        {({ values, handleChange }) => {
          return (
            <>
              <ScrollView style={styles.container}>
                <View>
                  <Text title1 bold>
                    When you established your Business in BTK?
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="establish"
                    value={values.establish}
                    onChangeText={handleChange('establish')}
                  />
                </View>
                {values.establish?.length >= 3 ? (
                  <View style={styles.stickyFooter}>
                    <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                    <Button>{'Next'}</Button>
                  </View>
                ) : null}
              </ScrollView>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  input: {
    marginTop: 15,
  },
  stickyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
});
