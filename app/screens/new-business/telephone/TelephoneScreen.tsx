import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Text, TextInput, Icon } from '@components';
import { BaseStyle } from '@config';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useBusiness } from '@screens/businesses/queries/queries';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import { Controller, useForm } from 'react-hook-form';

export const TelephoneScreen = (
  props: StackScreenProps<NewBusinessParamList, 'Telephone'>,
) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { mutate: editTelephone } = useEditBusiness(
    route?.params?.businessId ?? '',
  );
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');

  const telephone = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.telephone,
  );
  const setTelephone = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setTelephone,
  );

  const { control, handleSubmit } = useForm<BusinessStoreTypes>({
    defaultValues: {
      telephone: isEditBusiness ? businessData?.telephone : telephone,
    },
  });

  const onSubmit = (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editTelephone({ telephone: data.telephone });
      navigation.goBack();
    } else {
      setTelephone(data.telephone);
      // navigation.navigate('Email');
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
        title={isEditBusiness ? 'Update Number' : 'Add Telephone Number'}
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
          data={[0]}
          renderItem={() => {
            return (
              <Controller
                control={control}
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
                  </View>
                )}
                name="telephone"
              />
            );
          }}
        />

        <NavigationButtons
          onSubmit={handleSubmit(onSubmit)}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
});
