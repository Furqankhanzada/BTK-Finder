import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text } from '@components';

import { GlobalParamList } from 'navigation/models/GlobalParamList';
import useAppStore from '../../../appearance/store/store';

export default function AppearanceScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'Appearance'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { themeMode, font } = useAppStore();

  const darkOption = () => {
    switch (themeMode) {
      case 'light':
        return t('always_off');
      case 'dark':
        return t('always_on');
      case 'dynamic':
        return t('dynamic_system');
      default:
        return t('dynamic_system');
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('Appearance')}
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
      <ScrollView contentContainerStyle={styles.contain}>
        {/*        <TouchableOpacity
          style={[
            styles.profileItem,
            { borderBottomColor: colors.border, borderBottomWidth: 1 },
          ]}
          onPress={() => {
            navigation.navigate('ThemeSetting');
          }}>
          <Text body1>{t('theme')}</Text>
          <View
            style={[styles.themeIcon, { backgroundColor: colors.primary }]}
          />
        </TouchableOpacity>*/}
        <TouchableOpacity
          style={[
            styles.profileItem,
            styles.fontContainer,
            { borderBottomColor: colors.border },
          ]}
          onPress={() => navigation.navigate('SelectFontOption')}>
          <Text body1>{t('font')}</Text>
          <View style={styles.profileItemRightContainer}>
            <Text body1 grayColor>
              {font ?? t('default')}
            </Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={styles.angleRight}
              enableRTL={true}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.profileItem]}
          onPress={() => {
            navigation.navigate('SelectDarkOption');
          }}>
          <Text body1>{t('dark_theme')}</Text>
          <View style={styles.profileItemRightContainer}>
            <Text body1 grayColor>
              {darkOption()}
            </Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={styles.angleRight}
              enableRTL={true}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contain: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileItemRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontContainer: {
    borderBottomWidth: 1,
  },
  angleRight: {
    marginLeft: 5,
  },
  themeIcon: {
    width: 16,
    height: 16,
  },
});
