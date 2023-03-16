import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
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
import { useCodeVerification } from '../apis/mutations';

export default function VerifyCodeScreen(
  props: StackScreenProps<AuthParamList, 'VerifyCode'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { mutate: verifyCode, isLoading } = useCodeVerification();

  const [verificationCode, setVerificationCode] = useState('');

  /**
   * call when action reset pass
   */
  const onVerify = () => {
    verifyCode(
      { emailOrNumber: route.params.emailOrNumber, code: verificationCode },
      {
        onSuccess(response) {
          if (response.access_token) {
            navigation.navigate('ChangePassword');
          }
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
        title="Verify Code"
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
        style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.info}>
            <Icon
              name="info-circle"
              size={20}
              color={colors.primary}
              enableRTL={true}
              style={{ marginRight: 10 }}
            />
            <Text caption1>
              Enter the verification code you received on your provided Email
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setVerificationCode(text)}
            placeholder={'Enter Verification Code'}
            value={verificationCode}
            selectionColor={colors.primary}
            keyboardType="number-pad"
            onSubmitEditing={() => onVerify()}
            blurOnSubmit={true}
            returnKeyType="done"
          />
          <Button
            style={{ marginTop: 20 }}
            full
            onPress={() => {
              onVerify();
            }}
            loading={isLoading}>
            Submit Code
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
