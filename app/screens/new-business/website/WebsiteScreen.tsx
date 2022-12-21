import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
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

const webRejex =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const webSchema = Yup.object({
  website: Yup.string().matches(
    webRejex,
    'Please enter a valid url, ex: https://abc.com',
  ),
});

export const WebsiteScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.id;

  const { mutate: editWebsite } = useEditBusiness(route?.params?.id);
  const { data: businessData } = useBusiness(route?.params?.id);

  const website = useAddBusinessStore((state: any) => state.website);
  const setWebsite = useAddBusinessStore((state: any) => state.setWebsite);

  const navigateToNext = () => {
    navigation.navigate('Address');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Website' : 'Business Website '}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <Formik
          initialValues={{
            website: isEditBusiness ? businessData?.website : website,
          }}
          validationSchema={webSchema}
          onSubmit={(values) => {
            if (isEditBusiness) {
              editWebsite({ website: values.website });
              navigation.navigate('EditBusiness', { id: businessData?._id });
            } else {
              setWebsite(values.website);
              navigation.navigate('Address');
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
                          What is the official website of your Business ?{' '}
                          <Text body1>(optional)</Text>
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Website"
                          value={String(values.website)}
                          onChangeText={handleChange('website')}
                        />
                        <Text style={{ color: BaseColor.redColor }}>
                          {errors?.website?.toString()}
                        </Text>
                      </View>
                    );
                  }}
                />
                <View
                  style={
                    isEditBusiness
                      ? styles.stickyFooterEdit
                      : styles.stickyFooter
                  }>
                  {isEditBusiness ? null : (
                    <Button
                      style={styles.footerButtons}
                      onPress={navigateToBack}>
                      {'Back'}
                    </Button>
                  )}

                  <Button
                    style={[
                      styles.footerButtons,
                      errors?.website
                        ? { backgroundColor: BaseColor.grayColor }
                        : null,
                    ]}
                    title="submit"
                    onPress={handleSubmit}>
                    {isEditBusiness ? 'Update Website' : 'Next'}
                  </Button>
                </View>
              </>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
