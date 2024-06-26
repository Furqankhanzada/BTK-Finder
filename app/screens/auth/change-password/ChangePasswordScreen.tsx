import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as TextInputOriginal,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';

import { GlobalParamList } from 'navigation/models/GlobalParamList';
import { useChangePassword } from '@screens/auth/apis/mutations';

export default function ChangePasswordScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'ChangePassword'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const confirmPasswordRef = useRef<TextInputOriginal>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutate: changePassword, isLoading } = useChangePassword();

  const onConfirm = () => {
    if (newPassword === confirmPassword) {
      changePassword(
        { password: newPassword },
        {
          onSuccess() {
            navigation.navigate('Settings');
          },
        },
      );
    } else {
      Toast.show({
        type: 'error',
        topOffset: 55,
        text1: 'Error',
        text2: 'Password does not match',
      });
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('change_password')}
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
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={offsetKeyboard}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <Text headline semibold style={styles.title}>
            Enter New Password
          </Text>
          <TextInput
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={true}
            placeholder="New Password"
            value={newPassword}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            style={styles.textInput}
          />

          <Text headline semibold style={styles.title}>
            Confirm New Password
          </Text>
          <TextInput
            ref={confirmPasswordRef}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={true}
            placeholder="Confirm Password"
            value={confirmPassword}
            onSubmitEditing={() => onConfirm()}
            blurOnSubmit={true}
            returnKeyType="done"
            style={styles.textInput}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            loading={isLoading}
            full
            onPress={() => {
              onConfirm();
            }}>
            {t('confirm')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewContentContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  title: {
    marginBottom: 10,
  },
  contain: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    marginBottom: 10,
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
