import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { AuthActions } from '@actions';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
} from '@components';

import styles from './styles';
import { clearFavoriteBusiness } from '../../../actions/favorites';

export default function Welcome(props) {
  const { navigation, lastRoute } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const isLogin = useSelector((state) => state.auth.isLogin);
  const signOutLoading = useSelector((state) => state.auth.signOutLoading);
  const profileData = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const navigateToMyBusinesses = (id) => {
    navigation.navigate('MyBusinesses', { id });
  };

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = () => {
    dispatch(
      AuthActions.authentication(false, (response) => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications-count']);
      }),
    );
    dispatch(clearFavoriteBusiness());
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header title="More" />
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
                // point={profileData.}
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
                  { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
                onPress={() => {
                  navigation.navigate('ProfileEdit');
                }}>
                <Text body1>{t('edit_profile')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
                onPress={() => {
                  navigation.navigate('ChangePassword');
                }}>
                <Text body1>{t('change_password')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
                onPress={() => navigateToMyBusinesses(profileData._id)}>
                <Text body1>{t('my_businesses')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
              {profileData && profileData?.roles?.includes('ADMIN') ? (
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                    { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  ]}
                  onPress={() => navigation.navigate('SendNotification')}>
                  <Text body1>{t('send_notification.title')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 5 }}
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
            style={[
              styles.profileItem,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
            onPress={() => navigation.navigate('ContactUs')}>
            <Text body1>{t('contact_us')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{ marginLeft: 5 }}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
            onPress={() => {
              navigation.navigate('AboutUs');
            }}>
            <Text body1>{t('about_us')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileItem}
            onPress={() => {
              navigation.navigate('Setting');
            }}>
            <Text body1>Settings</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{ marginLeft: 5 }}
              enableRTL={true}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLogin ? (
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button full loading={signOutLoading} onPress={() => onLogOut()}>
            Sign Out
          </Button>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20 }}>
          <Button
            full
            loading={false}
            onPress={() => navigation.navigate('SignIn', { lastRoute })}>
            Sign In
          </Button>
          <Button
            style={{ marginVertical: 15 }}
            full
            loading={false}
            onPress={() => navigation.navigate('SignUp', { lastRoute })}>
            Sign Up
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
