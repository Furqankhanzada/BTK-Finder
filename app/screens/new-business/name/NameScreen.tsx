import React from 'react';
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

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, Text, TextInput } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { NewBusinessParamList } from '../../../navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import ArrowBack from '../components/ArrowBack';

export default function NameScreen(
  props: StackScreenProps<NewBusinessParamList, 'Name'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route.params?.businessId;

  const { data: businessData } = useBusiness(route.params?.businessId);
  const { mutate: editName, isLoading } = useEditBusiness();

  const name = useAddBusinessStore((state: BusinessStoreTypes) => state.name);
  const setName = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setName,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessStoreTypes>({
    defaultValues: {
      name: isEditBusiness ? businessData?.name : name,
    },
  });

  const onSubmit = async (form: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editName(
        {
          businessId: route.params.businessId,
          data: { name: form.name },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      if (form.name) {
        setName(form.name);
      }
      navigation.navigate('Description');
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
        title={isEditBusiness ? 'Edit Business Name' : 'Add New Business'}
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
              required: true,
              minLength: 3,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text title1 bold>
                  Please write your business name
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g Kababjees"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  success={!errors.name}
                />
                {errors.name?.type === 'minLength' ? (
                  <Text
                    style={[styles.errorText, { color: BaseColor.redColor }]}>
                    Name should be minimum 3 characters
                  </Text>
                ) : null}
              </View>
            )}
            name="name"
          />
        </ScrollView>

        <NavigationButtons
          onSubmit={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!!errors.name || isLoading}
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
