import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  navigation: any;
}

export const NameScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Discription');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Add Business" />

      <Formik
        initialValues={{ title: '' }}
        onSubmit={(values) => {
          console.log('Formik Values', values);
        }}>
        {({ values, handleChange }) => {
          return (
            <>
              <ScrollView style={styles.container}>
                <View>
                  <Text title1 bold>
                    What is your Business name ?
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Business name ?"
                    value={values.title}
                    onChangeText={handleChange('title')}
                  />
                </View>
                {values.title?.length >= 3 ? (
                  <View style={styles.stickyFooter}>
                    <Button>{'Back'}</Button>
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
