import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { styles } from '../styles/styles';
import { useBusiness } from '@screens/businesses/queries/queries';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useEditBusiness } from '../queries/mutations';
import useAddBusinessStore from '../store/Store';

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const emailSchema = Yup.object({
  email: Yup.string().email().matches(emailRegExp, 'Invalid Email!'),
});

export const EmailScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.id;

  const { mutate: editEmail } = useEditBusiness(route?.params?.id);
  const { data: businessData } = useBusiness(route?.params?.id);

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
        title={isEditBusiness ? 'Update Email Address' : 'Email Address '}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
        renderLeft={() => {
          return isEditBusiness ? (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          ) : null;
        }}
        onPressLeft={navigateToBack}
      />
      <Formik
        initialValues={{ email: isEditBusiness ? businessData?.email : email }}
        validationSchema={emailSchema}
        onSubmit={(values) => {
          if (isEditBusiness) {
            editEmail({ email: values.email });
            navigation.navigate('EditBusiness', { id: businessData?._id });
          } else {
            setEmail(values.email);
            navigation.navigate('Website');
          }
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
                        What is the valid Email address of your Business ?{' '}
                        <Text body1>(optional)</Text>
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                      />
                      <Text style={{ color: BaseColor.redColor }}>
                        {errors?.email?.toString()}
                      </Text>
                    </View>
                  );
                }}
              />

              <View
                style={
                  isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter
                }>
                {isEditBusiness ? null : (
                  <Button style={styles.footerButtons} onPress={navigateToBack}>
                    {'Back'}
                  </Button>
                )}

                <Button
                  style={[
                    styles.footerButtons,
                    errors?.email
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Email Address' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
