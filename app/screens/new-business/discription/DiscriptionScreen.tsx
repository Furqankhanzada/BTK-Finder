import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';

export const DiscriptionScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Category');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Add Discription" />
      <Formik
        initialValues={{ discription: '' }}
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
                        Write Discription of your Business
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Add Discription"
                        value={values.discription}
                        onChangeText={handleChange('discription')}
                      />
                    </View>
                  );
                }}
              />
              {values.discription?.length >= 3 ? (
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
