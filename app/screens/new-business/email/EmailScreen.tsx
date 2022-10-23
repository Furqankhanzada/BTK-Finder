import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const emailSchema = Yup.object({
  email: Yup.string().email().required('ex: abc@gmail.com'),
});

export const EmailScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const { colors } = useTheme();

  const email = useAddBusinessStore((state: any) => state.email);
  const setEmail = useAddBusinessStore((state: any) => state.setEmail);

  const navigateToNext = () => {
    navigation.navigate('Website');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Email Address"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{ email: email }}
        validationSchema={emailSchema}
        onSubmit={(values) => {
          navigation.navigate('Website');
          setEmail(values.email);
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
                        What is the valid Email address of your Business ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                      />
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button
                  style={styles.footerButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.footerButtons,
                    values.email.length < 6
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