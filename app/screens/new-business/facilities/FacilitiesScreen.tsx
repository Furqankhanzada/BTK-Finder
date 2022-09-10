import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

export const FacilitiesScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Tags');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Select Facilities" />
      <Formik
        initialValues={{ facilities: '' }}
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
                        Select facilities about your Business
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Add Discription"
                        value={values.facilities}
                        onChangeText={handleChange('facilities')}
                      />
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                {values.facilities?.length >= 3 ? (
                  <Button onPress={() => navigateToNext()}>{'Next'}</Button>
                ) : null}
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
