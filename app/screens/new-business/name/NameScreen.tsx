import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const nameSchema = Yup.object({
  title: Yup.string().required().min(3),
});

export const NameScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Add Business" />

      <Formik
        initialValues={{ title: '' }}
        validationSchema={nameSchema}
        onSubmit={(values) => {
          navigation.navigate('Discription');
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
                        What is your Business name ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Business name ?"
                        value={values.title}
                        onChangeText={handleChange('title')}
                      />
                    </View>
                  );
                }}
              />
              {values.title?.length >= 3 ? (
                <View style={styles.stickyFooter}>
                  <Button>{'Back'}</Button>
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
