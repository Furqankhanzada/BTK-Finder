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
import { BaseStyle } from '@config';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';

export default function DescriptionScreen(
  props: StackScreenProps<NewBusinessParamList, 'Description'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;

  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');
  const { mutate: editDescription, isLoading } = useEditBusiness(
    route?.params?.businessId ?? '',
  );

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

  const onSubmit = async (data: BusinessStoreTypes) => {
    if (isEditBusiness) {
      editDescription(
        { description: data.description },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setDescription(data.description);
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text title1 bold>
                      Describe about your business, Let people know about your
                      business <Text body1>(optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.textArea}
                      placeholder="e.g Kababjees are known for making each bite soulful and joyous..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                      textAlignVertical="top"
                    />
                  </View>
                )}
                name="description"
              />
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
  textArea: {
    height: 80,
    padding: 10,
    marginTop: 15,
  },
});
