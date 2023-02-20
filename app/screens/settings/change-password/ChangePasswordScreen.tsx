import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as TextInputOriginal,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { BaseColor, BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';

import { SettingsParamList } from '../../../navigation/models/SettingsParamList';
import { changePassword } from '../../../actions/auth';

export default function ChangePasswordScreen({
  navigation,
}: StackScreenProps<SettingsParamList, 'ChangePassword'>) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const confirmPasswordRef = useRef<TextInputOriginal>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const changePasswordLoading = useSelector(
    (state: any) => state.auth.changePasswordLoading,
  );

  const onConfirm = () => {
    if (newPassword === confirmPassword) {
      dispatch(
        changePassword({ password: newPassword }, () =>
          navigation.navigate('Settings'),
        ),
      );
    } else {
      Toast.show({
        type: 'error',
        topOffset: 55,
        text1: 'Error',
        text2: 'Password does not match',
      });
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('change_password')}
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
        style={{ flex: 1, justifyContent: 'center' }}
        keyboardVerticalOffset={offsetKeyboard}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            padding: 20,
          }}>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              Enter New Password
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={true}
            placeholder="New Password"
            value={newPassword}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          <TextInput
            ref={confirmPasswordRef}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={true}
            placeholder="Confirm Password"
            value={confirmPassword}
            onSubmitEditing={() => onConfirm()}
            blurOnSubmit={true}
            returnKeyType="done"
            style={{ marginTop: 10 }}
          />
          <View style={{ paddingVertical: 15 }}>
            <Button
              loading={changePasswordLoading}
              full
              onPress={() => {
                onConfirm();
              }}>
              {t('confirm')}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
});
