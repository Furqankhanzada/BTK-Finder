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

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, Text, TextInput, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { NewBusinessParamList } from '../../../navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';

export default function NameScreen(
  props: StackScreenProps<NewBusinessParamList, 'Name'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');
  const { mutate: editName, isLoading } = useEditBusiness(
    route?.params?.businessId ?? '',
  );

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

  const onSubmit = async (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editName(
        { name: data.name },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setName(data.name);
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
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <FlatList
          style={styles.container}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          data={[1]}
          renderItem={() => {
            return (
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
                        style={[
                          styles.errorText,
                          { color: BaseColor.redColor },
                        ]}>
                        Name should be minimum 3 characters
                      </Text>
                    ) : null}
                  </View>
                )}
                name="name"
              />
            );
          }}
        />

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
