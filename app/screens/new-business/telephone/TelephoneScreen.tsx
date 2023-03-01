import React from 'react';
import {
  FlatList,
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function TelephoneScreen(
  props: StackScreenProps<NewBusinessParamList, 'Telephone'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { mutate: editTelephone, isLoading } = useEditBusiness(
    route?.params?.businessId ?? '',
  );
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

  const onSubmit = (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editTelephone(
        { telephone: data.telephone },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setTelephone(data.telephone);
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
        <FlatList
          style={styles.container}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          data={[0]}
          renderItem={() => {
            return (
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
                    <Text title1 bold>
                      Add your business's contact number, Make it easy for users
                      to connect with you <Text body1>(optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Telephone Number"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />
                    {!isValid ? (
                      <Text
                        style={[
                          styles.errorText,
                          { color: BaseColor.redColor },
                        ]}>
                        Please use a valid number
                      </Text>
                    ) : null}
                  </View>
                )}
                name="telephone"
              />
            );
          }}
        />

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
