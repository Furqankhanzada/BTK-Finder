import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';

export const CategoryScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Facilities');
  };

  const navigateToBack = () => {
    navigation.navigate('Discription');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Select Category" />
      <Formik
        initialValues={{ category: '' }}
        onSubmit={(values) => {
          console.log('Formik Values', values);
        }}>
        {({ values, handleChange }) => {
          return (
            <>
              <ScrollView style={styles.container}>
                <View>
                  <Text title1 bold>
                    Select Category of your Business
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Category ?"
                    value={values.category}
                    onChangeText={handleChange('category')}
                  />
                </View>
                {values.category?.length >= 3 ? (
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
