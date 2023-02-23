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

import { Header, Text, TextInput, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';

const webRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export default function WebsiteScreen(
  props: StackScreenProps<NewBusinessParamList, 'Website'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { mutate: editWebsite, isLoading } = useEditBusiness(
    route?.params?.businessId ?? '',
  );
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');

  const website = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.website,
  );
  const setWebsite = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setWebsite,
  );

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<BusinessStoreTypes>({
    defaultValues: {
      website: isEditBusiness ? businessData?.website : website,
    },
  });

  const onSubmit = (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editWebsite(
        { website: data.website },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setWebsite(data.website);
      navigation.navigate('Address');
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
        title={isEditBusiness ? 'Update Website' : 'Business Website '}
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
                  pattern: {
                    value: webRegExp,
                    message: 'Invalid URL!',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text title1 bold>
                      Add your business's official website, Let users to know
                      about your business more <Text body1>(optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Website"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {!isValid ? (
                      <Text
                        style={[
                          styles.errorText,
                          { color: BaseColor.redColor },
                        ]}>
                        Please enter a valid URL
                      </Text>
                    ) : null}
                  </View>
                )}
                name="website"
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
