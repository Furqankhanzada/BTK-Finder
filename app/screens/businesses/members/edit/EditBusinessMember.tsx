import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput as TextInputOriginal,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput } from '@components';

import { Membership } from '@screens/businesses/models/BusinessPresentable';
import { useMembershipUpdate } from '@screens/businesses/queries/mutations';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import GlobalStyle from '../../../../assets/styling/GlobalStyle';

export default function EditBusinessMember(
  props: StackScreenProps<MembersStackParamList, 'EditMember'>,
) {
  const { navigation, route } = props;
  const { businessId, membership } = route.params;
  const { colors } = useTheme();
  const { mutateAsync, isLoading } = useMembershipUpdate(businessId);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Membership>({
    defaultValues: { ...membership },
  });

  const statusRef = useRef<TextInputOriginal>(null);
  const packageRef = useRef<TextInputOriginal>(null);
  const billlingDateRef = useRef<TextInputOriginal>(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onSubmit = async (data: Membership) => {
    mutateAsync(data, {
      onSuccess(response) {
        if (response.email) {
          navigation.goBack();
        }
      },
    });
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header
        title="Edit Member"
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={statusRef}
                placeholder="Active or Archieve"
                onSubmitEditing={() => packageRef.current?.focus()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.status}
              />
            )}
            name="status"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={packageRef}
                placeholder="Package name"
                onSubmitEditing={() => billlingDateRef.current?.focus()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.package}
              />
            )}
            name="package"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => toggleDatePicker()}
                  style={[
                    GlobalStyle.datePickerContainer,
                    { backgroundColor: colors.card },
                  ]}>
                  <Text
                    style={[
                      GlobalStyle.datePickerContainerText,
                      {
                        color: value ? colors.text : BaseColor.grayColor,
                      },
                    ]}>
                    {value
                      ? moment(value).format('DD/MM/YYYY')
                      : 'Billing Date [DD/MM/YYYY]'}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={(date) => {
                    onChange(date);
                    toggleDatePicker();
                  }}
                  onCancel={toggleDatePicker}
                />
              </>
            )}
            name="billingDate"
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button full loading={isLoading} onPress={handleSubmit(onSubmit)}>
            Update
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  textInput: {
    marginTop: 10,
  },
  scrollViewContentContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
