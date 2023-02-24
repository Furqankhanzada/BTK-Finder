import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as TextInputOriginal,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextInputMask from 'react-native-text-input-mask';
import Toast from 'react-native-toast-message';

import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput } from '@components';

import { SettingsParamList } from 'navigation/models/SettingsParamList';
import { register } from '../../../actions/auth';

export default function SignUpScreen(
  props: StackScreenProps<SettingsParamList, 'SignUp'>,
) {
  const { navigation, route } = props;
  const { params } = route;

  const nameRef = useRef<TextInputOriginal>(null);
  const emailRef = useRef<TextInputOriginal>(null);
  const passwordRef = useRef<TextInputOriginal>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    phone: true,
    password: true,
  });

  /**
   * call when action signup
   *
   */
  const onSignUp = () => {
    let lastRoute = params?.lastRoute?.lastRoute ?? params.lastRoute ?? '';

    if (name === '' || email === '' || phone === '' || password === '') {
      setSuccess({
        ...success,
        name: name !== '' ? true : false,
        email: email !== '' ? true : false,
        phone: phone !== '' ? true : false,
        password: password !== '' ? true : false,
      });
    } else {
      setLoading(true);
    }

    dispatch(
      register(
        { name, email, phone: phone.replace(/\s+/g, ''), password },
        (error) => {
          setLoading(false);
          if (!error) {
            navigation.navigate(lastRoute ? lastRoute : 'Settings');
            Toast.show({
              type: 'success',
              topOffset: 55,
              text1: 'Account Registered',
              text2: 'You have successfully registered an account, Login Now!',
            });
          }
        },
      ),
    );
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('sign_up')}
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
          <TextInputMask
            style={[
              styles.textInputMask,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            onChangeText={(text) => setPhone(text)}
            placeholder="+92 300 1234 567"
            placeholderTextColor={BaseColor.grayColor}
            keyboardType="numeric"
            value={phone}
            autoCapitalize="none"
            mask={'+92 [000] [0000] [000]'}
            returnKeyType="next"
            onSubmitEditing={() => nameRef?.current?.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={nameRef}
            style={styles.textInput}
            onChangeText={(text) => setName(text)}
            placeholder="Name"
            success={success.name}
            value={name}
            onSubmitEditing={() => emailRef?.current?.focus()}
          />
          <TextInput
            ref={emailRef}
            style={styles.textInput}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            keyboardType="email-address"
            success={success.email}
            value={email}
            autoCapitalize="none"
            onSubmitEditing={() => passwordRef?.current?.focus()}
          />
          <TextInput
            ref={passwordRef}
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            secureTextEntry={true}
            success={success.password}
            value={password}
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => onSignUp()}
          />
          <Button
            full
            style={styles.button}
            loading={loading}
            onPress={() => onSignUp()}>
            {t('sign_up')}
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
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  textInputMask: {
    height: 46,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  textInput: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
  },
});
