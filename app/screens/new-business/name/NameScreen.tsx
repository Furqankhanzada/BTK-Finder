import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const nameSchema = Yup.object({
  name: Yup.string().required('name must be atleats 3 words').min(3),
});

export const NameScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const navigateToBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Add Business" />

      <Formik
        initialValues={{ name: '' }}
        validationSchema={nameSchema}
        onSubmit={(values) => {
          navigation.navigate('Discription');
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
                        What is your Business name ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Business name ?"
                        value={values.name}
                        onChangeText={handleChange('name')}
                      />
                      <Text style={{ color: BaseColor.redColor }}>
                        {errors.name}
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
                    values.name.length < 3
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
