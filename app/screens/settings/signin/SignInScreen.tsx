import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput as TextInputOriginal,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  getSystemName,
  getSystemVersion,
  getUniqueId,
} from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import { useDeviceRegistration } from '../../../apis/mutations';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';

import { login } from '../../../actions/auth';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsParamList } from '../../../navigation/models/SettingsParamList';

export default function SignInScreen(
  props: StackScreenProps<SettingsParamList, 'SignIn'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { params } = route;
  const passwordRef = useRef<TextInputOriginal>(null);

  const { mutate: registerDevice } = useDeviceRegistration();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ username: true, password: true });

  /**
   * call when action login
   *
   */
  const onLogin = () => {
    let lastRoute = params?.lastRoute?.lastRoute ?? params.lastRoute ?? '';
    let id = params?.lastRoute?.id ?? '';
    if (username === '' || password === '') {
      setSuccess({
        ...success,
        username: false,
        password: false,
      });
    } else {
      setLoading(true);
      dispatch(
        login({ username, password }, async (error) => {
          setLoading(false);
          if (!error) {
            const fcmToken = await messaging().getToken();
            registerDevice({
              deviceUniqueId: getUniqueId(),
              fcmToken,
              os: getSystemName(),
              osVersion: getSystemVersion(),
            });

            navigation.navigate(lastRoute ? lastRoute : 'Welcome', { id });
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['notifications-count']);
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
    <SafeAreaView style={BaseStyle.safeAreaView}>
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
        style={styles.keyboardAvoidingView}>
        <View style={styles.contain}>
          <TextInput
            onChangeText={(text) => setUsername(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                username: true,
              });
            }}
            placeholder="Email or Phone"
            success={success.username}
            value={username}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={() => passwordRef?.current?.focus()}
          />
          <TextInput
            ref={passwordRef}
            style={styles.textInput}
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
            onSubmitEditing={() => onLogin()}
            returnKeyType="done"
            blurOnSubmit={true}
          />
          <Button
            style={styles.button}
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

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  textInput: {
    marginTop: 10,
  },
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  button: {
    marginTop: 20,
  },
});
