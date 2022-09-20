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
import { resetPassword } from '../../actions/auth';
import styles from './styles';

export default function ResetPassword(props) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const resetPasswordLoading = useSelector(
    state => state.auth.resetPasswordLoading,
  );

  const [emailOrNumber, setEmailOrNumber] = useState('');

  /**
   * call when action reset pass
   */
  const onReset = () => {
    dispatch(
      resetPassword({ emailOrNumber: emailOrNumber }, () =>
        navigation.navigate('VerifyCode', { emailOrNumber: emailOrNumber }),
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
              Currently this feature is only for Emails. For mobile number we
              are working on it and will be available in coming versions.
            </Text>
          </View>
          <TextInput
            onChangeText={text => setEmailOrNumber(text)}
            placeholder={'Email'}
            value={emailOrNumber}
            selectionColor={colors.primary}
            onSubmitEditing={() => onReset()}
            blurOnSubmit={true}
            keyboardType="email-address"
            returnKeyType="done"
          />
          <Button
            style={{ marginTop: 20 }}
            full
            onPress={() => {
              onReset();
            }}
            loading={resetPasswordLoading}>
            {t('reset_password')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
