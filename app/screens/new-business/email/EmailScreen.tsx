import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';
import { useBusiness } from '@screens/businesses/queries/queries';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useEditBusiness } from '../queries/mutations';

const emailSchema = Yup.object({
  email: Yup.string().email().required('ex: abc@gmail.com'),
});

export const EmailScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { mutate: useEditEmail, isLoading } = useEditBusiness(
    route?.params?.id,
  );
  const { data: businessData } = useBusiness(route?.params?.id);

  const email = useAddBusinessStore((state: any) => state.email);
  const setEmail = useAddBusinessStore((state: any) => state.setEmail);
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

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
        onPressLeft={() => {
          navigation.navigate('EditBusiness', { id: businessData?._id });
        }}
      />
      <Formik
        initialValues={{ email: isEditBusiness ? businessData?.email : email }}
        validationSchema={emailSchema}
        onSubmit={(values) => {
          isEditBusiness
            ? navigation.navigate('EditBusiness', { id: businessData?._id })
            : navigation.navigate('Website');
          isEditBusiness
            ? useEditEmail({ ...businessData, email: values.email })
            : setEmail(values.email);
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
                    values?.email?.length < 6
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
