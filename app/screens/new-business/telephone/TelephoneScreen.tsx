import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function TelephoneScreen(
  props: StackScreenProps<NewBusinessParamList, 'Telephone'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route.params?.businessId;

  const { mutate: editTelephone, isLoading } = useEditBusiness();
  const { data: businessData } = useBusiness(route.params?.businessId);

  const telephone = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.telephone,
  );
  const setTelephone = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setTelephone,
  );

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<BusinessStoreTypes>({
    defaultValues: {
      telephone: isEditBusiness ? businessData?.telephone : telephone,
    },
  });

  useEffect(() => {
    if (isEditBusiness) {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        // Delay the reset to avoid flickering
        setTimeout(() => {
          setTelephone('');
        }, 300);
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onSubmit = (form: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editTelephone(
        {
          businessId: route.params.businessId,
          data: { telephone: form.telephone },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      if (form.telephone) {
        setTelephone(form.telephone);
      }
      navigation.navigate('Email');
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
        title={isEditBusiness ? 'Update Number' : 'Add Telephone Number'}
        renderLeft={() => <ArrowBack show={!!isEditBusiness} />}
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <ScrollView style={styles.container}>
          <Controller
            control={control}
            rules={{
              pattern: {
                value: phoneRegExp,
                message: 'Invalid Phone!',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text title2 bold>
                  Add your business's contact number, Make it easy for users to
                  connect with you <Text body1>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g 03001264820"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setTelephone(text);
                  }}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  value={value}
                  keyboardType="number-pad"
                />
                {!isValid ? (
                  <Text
                    style={[styles.errorText, { color: BaseColor.redColor }]}>
                    Please use a valid number
                  </Text>
                ) : null}
              </View>
            )}
            name="telephone"
          />
        </ScrollView>

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
