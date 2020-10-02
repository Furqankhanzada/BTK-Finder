import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { login } from '../../actions/auth';

export default function SignIn({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ username: true, password: true });

  /**
   * call when action login
   *
   */
  const onLogin = () => {
    if (username === '' || password === '') {
      setSuccess({
        ...success,
        username: false,
        password: false,
      });
    } else {
      setLoading(true);
      dispatch(
        login({ username, password }, (error) => {
          setLoading(false);
          if (!error) {
            navigation.navigate('Home');
          }
        }),
      );
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('sign_in')}
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
        <View style={styles.contain}>
          <TextInput
            onChangeText={(text) => setUsername(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                username: true,
              });
            }}
            placeholder="Email"
            success={success.username}
            value={username}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setPassword(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                password: true,
              });
            }}
            placeholder="Password"
            secureTextEntry={true}
            success={success.password}
            value={password}
          />
          <Button
            style={{ marginTop: 20 }}
            full
            loading={loading}
            onPress={() => {
              onLogin();
            }}>
            {t('sign_in')}
          </Button>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}>
            <Text body1 grayColor style={{ marginTop: 25 }}>
              {t('forgot_your_password')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
