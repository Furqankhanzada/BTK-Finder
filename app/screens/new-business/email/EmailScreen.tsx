import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, TextInput } from '@components';
import { BaseColor, BaseStyle } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import ArrowBack from '../components/ArrowBack';

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export default function EmailScreen(
  props: StackScreenProps<NewBusinessParamList, 'Email'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route.params?.businessId;

  const { mutate: editEmail, isLoading } = useEditBusiness();
  const { data: businessData } = useBusiness(route.params?.businessId);

  const email = useAddBusinessStore((state: BusinessStoreTypes) => state.email);
  const setEmail = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setEmail,
  );

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<BusinessStoreTypes>({
    defaultValues: {
      email: isEditBusiness ? businessData?.email : email,
    },
  });

  const onSubmit = (form: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editEmail(
        {
          businessId: route.params.businessId,
          data: { email: form.email },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      if (form.email) {
        setEmail(form.email);
      }
      navigation.navigate('Website');
    }
  };

  const navigateToBack = () => {
    if (isEditBusiness) {
      navigation.goBack();
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Email Address' : 'Email Address '}
        renderLeft={() => <ArrowBack show={!!isEditBusiness} />}
        onPressLeft={navigateToBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <View style={styles.container}>
          <Controller
            control={control}
            rules={{
              pattern: {
                value: emailRegExp,
                message: 'Invalid Email!',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text title1 bold>
                  What is the valid Email address of your Business ?{' '}
                  <Text body1>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g explore.btk@gmail.com"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {!isValid ? (
                  <Text
                    style={[styles.errorText, { color: BaseColor.redColor }]}>
                    Please use a valid email
                  </Text>
                ) : null}
              </View>
            )}
            name="email"
          />
        </View>

        <NavigationButtons
          onSubmit={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || isLoading}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
  input: {
    marginTop: 15,
  },
  errorText: {
    marginTop: 5,
  },
});
