import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { newBusinessStyles } from '../styles/NewBusinessStyles';
import { NewBusinessParamList } from '../../../navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';

export const NameScreen = (
  props: StackScreenProps<NewBusinessParamList, 'Name'>,
) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');
  const { mutate: editName } = useEditBusiness(route?.params?.businessId);

  const setName = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setName,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessStoreTypes>({
    defaultValues: {
      name: isEditBusiness ? businessData?.name : '',
    },
  });

  const onSubmit = async (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editName({ name: data.name });
      // navigation.navigate('EditBusiness', { id: businessData?._id });
    } else {
      setName(data.name);
      // navigation.navigate('Description');
    }
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
        title={isEditBusiness ? 'Edit Business Name' : 'Add Business'}
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
        style={newBusinessStyles.keyboardAvoidView}>
        <FlatList
          style={newBusinessStyles.container}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          data={[1]}
          renderItem={() => {
            return (
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text title1 bold>
                      Please write your business name
                    </Text>
                    <TextInput
                      style={newBusinessStyles.input}
                      placeholder="e.g Kababjees"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      success={!errors.name}
                    />
                  </View>
                )}
                name="name"
              />
            );
          }}
        />

        <View
          style={
            isEditBusiness
              ? newBusinessStyles.stickyFooterEdit
              : newBusinessStyles.stickyFooter
          }>
          {isEditBusiness ? null : (
            <Button
              style={newBusinessStyles.footerButton}
              onPress={navigateToBack}>
              {'Back'}
            </Button>
          )}

          <Button
            style={[
              newBusinessStyles.footerButton,
              errors.name ? { backgroundColor: BaseColor.grayColor } : null,
            ]}
            title="submit"
            onPress={handleSubmit(onSubmit)}>
            {isEditBusiness ? 'Update Name' : 'Next'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
