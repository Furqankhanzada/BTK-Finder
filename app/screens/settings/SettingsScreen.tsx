import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { StackScreenProps } from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

import { AuthActions } from '@actions';
import { BaseColor, BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
} from '@components';

import { GlobalParamList } from 'navigation/models/GlobalParamList';

export default function SettingsScreen(
  props: StackScreenProps<GlobalParamList, 'Settings'>,
) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const isLogin = useSelector((state: any) => state.auth.isLogin);
  const profileData = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  const navigateToMyBusinesses = (id: string) => {
    navigation.navigate('MyBusinesses', { id });
  };

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = () => {
    dispatch(
      AuthActions.authentication(false, () => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications-count']);
      }),
    );
  };

  const CopyToClipboard = () => {
    Clipboard.setString(
      `UserId ${
        profileData._id
      }\nApp Version ${DeviceInfo.getVersion()}\nBuild Number ${DeviceInfo.getBuildNumber()}`,
    );
    Toast.show('Information copied to clipboard');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Settings" />
      <ScrollView>
        <View style={styles.contain}>
          {isLogin ? (
            <View>
              <ProfileDetail
                image={
                  profileData.avatar
                    ? { uri: profileData.avatar }
                    : require('@assets/images/default-avatar.png')
                }
                textFirst={profileData.name}
                textSecond={profileData.email}
                textThird={profileData.phone}
                isAdmin={
                  profileData && profileData.roles
                    ? profileData.roles[0] === 'ADMIN'
                    : false
                }
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
                  navigation.navigate('ChangePassword');
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
                onPress={() => navigateToMyBusinesses(profileData._id)}>
                <Text body1>{t('my_businesses')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  enableRTL={true}
                />
              </TouchableOpacity>
              {profileData && profileData?.roles?.includes('ADMIN') ? (
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
            {isLogin && profileData?._id ? (
              <Text body2 bold grayColor>
                UserId {profileData._id}
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
