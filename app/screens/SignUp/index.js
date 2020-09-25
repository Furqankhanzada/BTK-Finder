import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

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
    if (name == '' || email == '' || phone == '' || password == '') {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        phone: phone != '' ? true : false,
        password: password != '' ? true : false,
      });
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('SignIn');
      }, 500);
    }
    console.log('Username: ', name);
    console.log('Email: ', email);
    console.log('Phone: ', phone);
    console.log('Password: ', password);
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
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
        style={{flex: 1}}>
        <View style={styles.contain}>
          <TextInput
            onChangeText={text => setName(text)}
            placeholder= 'Username'
            success={success.name}
            value={name}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setEmail(text)}
            placeholder= 'Email Address'
            keyboardType="email-address"
            success={success.email}
            value={email}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setPhone(text)}
            placeholder= 'Phone Number'
            success={success.phone}
            value={phone}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setPassword(text)}
            placeholder='Password'
            secureTextEntry={true}
            success={success.password}
            value={password}
          />
          <Button
            full
            style={{marginTop: 20}}
            loading={loading}
            onPress={() => onSignUp()}>
            {t('sign_up')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
