import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';

export const WebsiteScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Established');
  };

  const navigateToBack = () => {
    navigation.navigate('Email');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Business Website" />
      <Formik
        initialValues={{ website: '' }}
        onSubmit={(values) => {
          console.log('Formik Values', values);
        }}>
        {({ values, handleChange }) => {
          return (
            <>
              <ScrollView style={styles.container}>
                <View>
                  <Text title1 bold>
                    What is official website of your Business ?
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="website"
                    value={values.website}
                    onChangeText={handleChange('website')}
                  />
                </View>
                {values.website?.length >= 3 ? (
                  <View style={styles.stickyFooter}>
                    <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                    <Button onPress={() => navigateToNext()}>{'Next'}</Button>
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
