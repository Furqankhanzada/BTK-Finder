import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Button,
  Text,
} from '@components';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { verifyCode } from '../../actions/auth';
import styles from '../ResetPassword/styles';

export default function VerifyCode(props) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const verifyCodeLoading = useSelector(state => state.auth.verifyCodeLoading);

  const [verificationCode, setVerificationCode] = useState('');

  /**
   * call when action reset pass
   */
  const onVerify = () => {
    dispatch(
      verifyCode(
        { emailOrNumber: route.params.emailOrNumber, code: verificationCode },
        () => navigation.navigate('ChangePassword'),
      ),
    );
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
            onChangeText={text => setVerificationCode(text)}
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
            loading={verifyCodeLoading}>
            Submit Code
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
