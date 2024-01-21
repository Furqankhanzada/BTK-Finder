import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Button,
  TextInput,
  Text,
} from '@components';
import { Membership } from '@screens/settings/profile/models/UserPresentable';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';

export default function EmailScreen(
  props: StackScreenProps<AddMembersParamList, 'Email'>,
) {
  const { navigation } = props;
  // const businessId = '6401d1445d381e3bcd4b47e7';

  const { colors } = useTheme();
  const {
    control,
    formState: { errors },
  } = useForm<Membership>();

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  // const onSubmit = async (data: Membership) => {
  //   // Perform necessary actions for submitting email
  //   // ...

  //   // For example, navigate back after submission
  //   navigation.goBack();
  // };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header
        title="Email Address"
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
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text title1 bold>
                  What is the valid Email address of your Membership ?{' '}
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  // onSubmitEditing={() => setModalVisible(true)}
                  blurOnSubmit={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  success={!errors.email}
                />
              </View>
            )}
            name="email"
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate('Packages')}
            // onPress={() =>
            //   navigation.navigate('Pakages', {
            //     businessId: businessId,
            //   })
            // }
          >
            Next
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
