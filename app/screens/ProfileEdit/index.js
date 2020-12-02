import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BaseStyle, useTheme } from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { editProfile } from '../../actions/auth';

export default function ProfileEdit({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const profileData = useSelector((state) => state.profile);
  // console.log('++++++++++++++++++++++++', profileData);
  const dispatch = useDispatch();

  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [phone, setPhone] = useState(profileData.phone);
  // const [address, setAddress] = useState(UserData[0].address);
  // const [image] = useState(UserData[0].image);
  const [loading, setLoading] = useState(false);

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const onSubmit = () => {
    dispatch(editProfile({ name, email, phone, _id: profileData._id }));
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('edit_profile')}
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
        onPressRight={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.contain}>
          <View>
            <Image source={require('@assets/images/default-avatar.png')} style={styles.thumb} />
          </View>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('name')}
            </Text>
          </View>
          <TextInput
            onChangeText={text => setName(text)}
            placeholder={t('input_name')}
            value={name}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            onChangeText={text => setEmail(text)}
            placeholder={t('input_email')}
            value={email}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {'Phone'}
            </Text>
          </View>
          <TextInput
            onChangeText={text => setPhone(text)}
            placeholder={'Input Phone'}
            value={phone}
          />
          {/* <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('address')}
            </Text>
          </View>
          <TextInput
            onChangeText={text => setAddress(text)}
            placeholder={t('input_address')}
            value={address}
          /> */}
        </ScrollView>
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onSubmit();
              setLoading(true);
              setTimeout(() => {
                navigation.goBack();
              }, 500);
            }}>
            {t('confirm')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
