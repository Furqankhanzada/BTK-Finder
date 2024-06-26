import React, { useEffect } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, Text, TextInput } from '@components';
import { BaseStyle } from '@config';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import ArrowBack from '../components/ArrowBack';

export default function DescriptionScreen(
  props: StackScreenProps<NewBusinessParamList, 'Description'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route.params?.businessId;

  const { data: businessData } = useBusiness(route.params?.businessId);
  const { mutate: editDescription, isLoading } = useEditBusiness();

  const description = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.description,
  );
  const setDescription = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setDescription,
  );

  const { control, handleSubmit } = useForm<BusinessStoreTypes>({
    defaultValues: {
      description: isEditBusiness ? businessData?.description : description,
    },
  });

  useEffect(() => {
    if (isEditBusiness) {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        // Delay the reset to avoid flickering
        setTimeout(() => {
          setDescription('');
        }, 300);
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onSubmit = async (form: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editDescription(
        {
          businessId: route.params.businessId,
          data: { description: form.description },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      if (form.description) {
        setDescription(form.description);
      }
      navigation.navigate('CategorySelect');
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
        title={isEditBusiness ? 'Edit Business Description' : 'Add Description'}
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
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text title2 bold>
                  Describe about your business and let people know what you do{' '}
                  <Text body1>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="e.g Kababjees are known for making each bite soulful and joyous..."
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setDescription(text);
                  }}
                  value={value}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            )}
            name="description"
          />
        </View>

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
  textArea: {
    minHeight: Dimensions.get('window').height / 2,
    padding: 10,
    marginTop: 15,
  },
});
