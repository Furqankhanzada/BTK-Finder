import React from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  Linking,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { useRemoteConfig } from '@hooks';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileDescription,
} from '@components';

import { SettingsParamList } from '../../../navigation/models/SettingsParamList';

export default function AboutUsScreen({
  navigation,
}: StackScreenProps<SettingsParamList, 'AboutUs'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const remoteConfig = useRemoteConfig();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('about_us')}
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
      <ScrollView style={styles.scrollView}>
        <ImageBackground
          source={{ uri: remoteConfig.about?.backgroundImage }}
          style={styles.banner}
        />
        <View style={styles.content}>
          {remoteConfig.about?.whoWeAre ? (
            <View>
              <Text headline semibold>
                {t('who_we_are').toUpperCase()}
              </Text>
              <Text body2 style={styles.aboutText} numberOfLines={20}>
                {remoteConfig.about?.whoWeAre}
              </Text>
            </View>
          ) : null}
        </View>
        {remoteConfig.about?.ourTeam ? (
          <View>
            <Text headline semibold style={styles.title}>
              {t('meet_our_team').toUpperCase()}
            </Text>
            <View style={styles.teamContainer}>
              {remoteConfig.about?.ourTeam?.map((item, index) => {
                return (
                  <ProfileDescription
                    key={'service' + index}
                    image={item.image}
                    name={item.name}
                    subName={item.subName}
                    description={item.description}
                    style={styles.teamItemContainer}
                    onPress={() => item.link && Linking.openURL(item.link)}
                  />
                );
              })}
            </View>
          </View>
        ) : null}
        {remoteConfig.about?.disclaimer ? (
          <View style={styles.disclaimerContainer}>
            <Text headline semibold style={styles.disclaimerTitle}>
              DISCLAIMER
            </Text>
            <Text>{remoteConfig.about?.disclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  banner: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'flex-start',
    width: '100%',
    padding: 20,
  },
  aboutText: {
    marginTop: 10,
  },
  team: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  teamContainer: {
    paddingHorizontal: 20,
  },
  teamItemContainer: {
    marginBottom: 10,
  },
  disclaimerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  disclaimerTitle: {
    marginBottom: 10,
    color: 'red',
  },
});
