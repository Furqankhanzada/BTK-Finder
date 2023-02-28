import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle } from '@config';
import { Header, Text, TextInput } from '@components';
import { useBusiness } from '@screens/businesses/queries/queries';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import { Controller, useForm } from 'react-hook-form';
import ArrowBack from '../components/ArrowBack';

export default function PricingScreen(
  props: StackScreenProps<NewBusinessParamList, 'Pricing'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { mutate: EditPrice, isLoading } = useEditBusiness(
    route?.params?.businessId ?? '',
  );
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');

  const priceRange = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.priceRange,
  );
  const setPriceRange = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setPriceRange,
  );

  const { control, handleSubmit } = useForm<BusinessStoreTypes>({
    defaultValues: {
      priceRange: isEditBusiness ? businessData?.priceRange : priceRange,
    },
  });

  const onSubmit = (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      EditPrice(
        {
          priceRange: data.priceRange,
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setPriceRange(data.priceRange);
      navigation.navigate('Gallery');
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
        title={isEditBusiness ? 'Edit Pricing' : 'Pricing'}
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
          data={[1]}
          renderItem={() => {
            return (
              <>
                <Text title1 bold>
                  What are the pricing of products/items of your business?{' '}
                  <Text body1>(optional)</Text>
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="From"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />
                  )}
                  name="priceRange.from"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="To"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />
                  )}
                  name="priceRange.to"
                />
              </>
            );
          }}
        />

        <NavigationButtons
          onSubmit={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
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
});
