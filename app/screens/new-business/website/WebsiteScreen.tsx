import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const webRejex =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const webSchema = Yup.object({
  website: Yup.string().matches(webRejex, 'Please enter website'),
});

export const WebsiteScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Business Website" />
      <Formik
        initialValues={{ website: '' }}
        validationSchema={webSchema}
        onSubmit={(values) => {
          navigation.navigate('Established');
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
                        What is the official website of your Business ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Website"
                        value={values.website}
                        onChangeText={handleChange('website')}
                      />
                    </View>
                  );
                }}
              />
              {values.website?.length >= 3 ? (
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
