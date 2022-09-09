import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';

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
        onSubmit={(values) => {
          console.log('Formik Values', values);
        }}>
        {({ values, handleChange }) => {
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
              {values.telephone?.length >= 3 ? (
                <View style={styles.stickyFooter}>
                  <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                  <Button onPress={() => navigateToNext()}>{'Next'}</Button>
                </View>
              ) : null}
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
