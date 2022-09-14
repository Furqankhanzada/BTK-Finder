import React, { useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const hoursSchema = Yup.object({
  name: Yup.string().required('name must be atleats 3 words').min(3),
});

export const Hours = ({ navigation }: StackScreenProps<GlobalParamList>) => {
  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Opne Hours" />

      <Formik
        initialValues={{ hours: '' }}
        validationSchema={hoursSchema}
        onSubmit={(values) => {
          navigation.navigate('Home');
        }}>
        {({ values, handleChange, handleSubmit, errors }) => {
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
                        What is your Business address ?
                      </Text>
                      <TextInput
                        style={styles.textArea}
                        placeholder="Open Hours ?"
                        value={values.hours}
                        multiline={true}
                        textAlignVertical="top"
                        onChangeText={handleChange('address')}
                      />
                      <Text style={{ color: BaseColor.redColor }}>
                        {errors.hours}
                      </Text>
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button style={styles.fotterButtons} onPress={navigateToBack}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.fotterButtons,
                    values.hours.length < 10
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
