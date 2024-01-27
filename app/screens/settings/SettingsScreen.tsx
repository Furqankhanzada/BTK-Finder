import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { StackScreenProps } from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

import { BaseColor, BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
} from '@components';
import useAuthStore from '@screens/auth/store/Store';

import { GlobalParamList } from 'navigation/models/GlobalParamList';

export default function SettingsScreen(
  props: StackScreenProps<GlobalParamList, 'Settings'>,
) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { user, isLogin, setIsLogin } = useAuthStore();

  const navigateToMyBusinesses = () => {
    navigation.navigate('MyBusinessesStack', {
      screen: 'MyBusinesses',
    });
  };

  const onLogOut = () => {
    setIsLogin(false);
    AsyncStorage.removeItem('access_token');
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['notifications-count']);
    queryClient.removeQueries(['profile']);
  };

  const CopyToClipboard = () => {
    Clipboard.setString(
      `UserId ${
        user?._id
      }\nApp Version ${DeviceInfo.getVersion()}\nBuild Number ${DeviceInfo.getBuildNumber()}`,
    );
    Toast.show('Information copied to clipboard');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Settings" />
      <ScrollView>
        <View style={styles.contain}>
          {isLogin && user ? (
            <View>
              <ProfileDetail
                image={
                  user.avatar
                    ? { uri: user.avatar }
                    : require('@assets/images/default-avatar.png')
                }
                textFirst={user.name}
                textSecond={user.email}
                textThird={user.phone}
                isAdmin={user && user.roles ? user.roles[0] === 'ADMIN' : false}
              />
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text body1>{t('edit_profile')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  enableRTL={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  navigation.navigate('AuthStackNavigator', {
                    screen: 'ChangePassword',
                  });
                }}>
                <Text body1>{t('change_password')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  enableRTL={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() =>
                  navigation.navigate('MyMembershipsStack', {
                    screen: 'MyMemberships',
                  })
                }>
                <Text body1>{t('My Memberships')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  enableRTL={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={navigateToMyBusinesses}>
                <Text body1>{t('my_businesses')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  enableRTL={true}
                />
              </TouchableOpacity>
              {user && user?.roles?.includes('ADMIN') ? (
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => navigation.navigate('SendNotification')}>
                  <Text body1>{t('send_notification')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <ProfileDetail
              image={require('@assets/images/default-avatar.png')}
              textSecond="Sign in to view your profile"
            />
          )}
          <TouchableOpacity
            style={[styles.profileItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('ContactUs')}>
            <Text body1>{t('contact_us')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              navigation.navigate('AboutUs');
            }}>
            <Text body1>{t('about_us')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              isLogin
                ? { borderBottomColor: colors.border }
                : styles.profileItemBorderLess,
            ]}
            onPress={() => {
              navigation.navigate('Appearance');
            }}>
            <Text body1>Appearance</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              enableRTL={true}
            />
          </TouchableOpacity>
          {isLogin && (
            <TouchableOpacity
              style={[styles.profileItem, styles.signoutItem]}
              onPress={onLogOut}>
              <Text body1 style={{ color: BaseColor.redColor }}>
                Sign Out
              </Text>
              <Icon
                name="sign-out-alt"
                size={18}
                color={BaseColor.redColor}
                enableRTL={true}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.appInfoContainer}
            onLongPress={CopyToClipboard}>
            {isLogin && user?._id ? (
              <Text body2 bold grayColor>
                UserId {user._id}
              </Text>
            ) : null}
            <Text body2 bold grayColor>
              App Version {DeviceInfo.getVersion()}
            </Text>
            <Text body2 bold grayColor>
              Build Number {DeviceInfo.getBuildNumber()}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {!isLogin && (
        <View style={styles.buttonsContainer}>
          <Button
            full
            loading={false}
            onPress={() =>
              navigation.navigate('AuthStackNavigator', {
                screen: 'SignIn',
              })
            }>
            Sign In
          </Button>
          <Button
            style={styles.signupButton}
            full
            loading={false}
            onPress={() =>
              navigation.navigate('AuthStackNavigator', {
                screen: 'SignUp',
              })
            }>
            Sign Up
          </Button>
        </View>
      )}
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
    height: 56,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  profileItemBorderLess: {
    borderBottomWidth: 0,
  },
  signoutItem: {
    borderBottomWidth: 0,
  },
  appInfoContainer: {
    marginTop: 10,
  },
  signoutButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  signupButton: {
    marginVertical: 15,
  },
});
