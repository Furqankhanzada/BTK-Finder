import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Button,
  Text,
} from '@components';

import { AuthParamList } from '../../../navigation/models/AuthParamList';
import { useResetPassword } from '../apis/mutations';

export default function ResetPasswordScreen(
  props: StackScreenProps<AuthParamList, 'ResetPassword'>,
) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { mutate: resetPassword, isLoading } = useResetPassword();

  const [emailOrNumber, setEmailOrNumber] = useState('');

  /**
   * call when action reset pass
   */
  const onReset = () => {
    resetPassword(
      { emailOrNumber: emailOrNumber },
      {
        onSuccess() {
          navigation.navigate('VerifyCode', { emailOrNumber: emailOrNumber });
        },
      },
    );
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('reset_password')}
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
        <View style={styles.container}>
          <View style={styles.info}>
            <Icon
              name="info-circle"
              size={20}
              color={colors.primary}
              enableRTL={true}
              style={styles.infoIcon}
            />
            <Text caption1>
              Currently this feature is only for Emails. For mobile number we
              are working on it and will be available in coming versions.
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setEmailOrNumber(text)}
            placeholder={'Email'}
            value={emailOrNumber}
            selectionColor={colors.primary}
            onSubmitEditing={() => onReset()}
            blurOnSubmit={true}
            keyboardType="email-address"
            returnKeyType="done"
          />
          <Button
            style={styles.button}
            full
            onPress={() => {
              onReset();
            }}
            loading={isLoading}>
            {t('reset_password')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 10,
  },
  button: {
    marginTop: 20,
  },
});
