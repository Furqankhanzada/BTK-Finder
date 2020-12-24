import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
import { getProfile } from '../../actions/auth';
import { useTranslation } from 'react-i18next';
import { showBetaModal } from '../../popup/betaPopup';

export default function Profile(props) {
  const { navigation, lastRoute } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const isLogin = useSelector((state) => state.auth.isLogin);
  const signOutLoading = useSelector((state) => state.auth.signOutLoading);
  const profileData = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = () => {
    dispatch(AuthActions.authentication(false, (response) => {}));
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
                // onPress={() => navigation.navigate('ProfileExanple')}
              />
              {/* <ProfilePerformance
            data={userData.performance}
            style={{ marginTop: 20, marginBottom: 20 }}
          /> */}
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
                // onPress={() => {
                //   navigation.navigate('ChangePassword');
                // }}
                onPress={showBetaModal}>
                <Text body1>{t('change_password')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
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
            // onPress={() => navigation.navigate('ContactUs')}
            onPress={showBetaModal}>
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
            // onPress={() => {
            //   navigation.navigate('AboutUs');
            // }}
            onPress={showBetaModal}>
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
