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

const webRegExp =
  /^https?:\/\/(?:www\.)?[a-z0-9]+(?:\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export default function WebsiteScreen(
  props: StackScreenProps<NewBusinessParamList, 'Website'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route.params?.businessId;

  const { mutate: editWebsite, isLoading } = useEditBusiness();
  const { data: businessData } = useBusiness(route.params?.businessId);

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

  useEffect(() => {
    if (isEditBusiness) {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        // Delay the reset to avoid flickering
        setTimeout(() => {
          setWebsite('');
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
      editWebsite(
        {
          businessId: route.params.businessId,
          data: { website: form.website },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      if (form.website) {
        setWebsite(form.website);
      }
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
                value: webRegExp,
                message: 'Invalid URL!',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text title2 bold>
                  Add your business's official website, Let users to know about
                  your business more <Text body1>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g https://explorebtk.com"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setWebsite(text);
                  }}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  value={value}
                  keyboardType="url"
                  autoCapitalize="none"
                />
                {!isValid ? (
                  <Text
                    style={[styles.errorText, { color: BaseColor.redColor }]}>
                    Please enter a valid URL
                  </Text>
                ) : null}
              </View>
            )}
            name="website"
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
