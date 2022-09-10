import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const discriptionSchema = Yup.object({
  discription: Yup.string().required().min(10),
});

export const DiscriptionScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Add Discription" />
      <Formik
        initialValues={{ discription: '' }}
        validationSchema={discriptionSchema}
        onSubmit={(values) => {
          navigation.navigate('Category');
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
