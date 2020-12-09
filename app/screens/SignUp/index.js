import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput } from '@components';
import TextInputMask from 'react-native-text-input-mask';
import { useDispatch } from 'react-redux';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { register } from '../../actions/auth';
import Toast from 'react-native-toast-message';

export default function SignUp(props) {
  const { navigation, route } = props;
  const { params } = route;

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
    let lastRoute = params && params.lastRoute ? params.lastRoute : '';

    if (name === '' || email === '' || phone === '' || password === '') {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        phone: phone != '' ? true : false,
        password: password != '' ? true : false,
      });
    } else {
      setLoading(true);
    }

    dispatch(
      register({ name, email, phone, password }, (error) => {
        setLoading(false);
        if (!error) {
          navigation.navigate('SignIn', { lastRoute });
          Toast.show({
            type: 'success',
            topOffset: 55,
            text1: 'Account Registered',
            text2: 'You have successfully registered an account, Login Now!',
          });
        }
      }),
    );
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
        style={{ flex: 1 }}>
        <View style={styles.contain}>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder="Name"
            success={success.name}
            value={name}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            keyboardType="email-address"
            success={success.email}
            value={email}
            autoCapitalize="none"
          />
          <TextInputMask
            style={[
              styles.textInput,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            // refInput={(ref) => {
            //   this.input = ref;
            // }}
            onChangeText={(text) => setPhone(text)}
            placeholder="+92 300 1234 567"
            placeholderTextColor={BaseColor.grayColor}
            keyboardType="numeric"
            success={success.phone}
            value={phone}
            autoCapitalize="none"
            mask={'+92 [000] [0000] [000]'}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            secureTextEntry={true}
            success={success.password}
            value={password}
            autoCapitalize="none"
          />
          <Button
            full
            style={{ marginTop: 20 }}
            loading={loading}
            onPress={() => onSignUp()}>
            {t('sign_up')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
