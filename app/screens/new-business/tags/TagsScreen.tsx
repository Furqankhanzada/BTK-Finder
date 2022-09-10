import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

export const TagsScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToNext = () => {
    navigation.navigate('Telephone');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Select Tags" />
      <Formik
        initialValues={{ tags: '' }}
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
                        Select tags about your Business
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Select tags"
                        value={values.tags}
                        onChangeText={handleChange('tags')}
                      />
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button onPress={() => navigateToBack()}>{'Back'}</Button>
                {values.tags?.length >= 3 ? (
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
