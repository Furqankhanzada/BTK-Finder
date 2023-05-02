import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text } from '@components';
import { useAlerts } from '@hooks';

import { GlobalParamList } from 'navigation/models/GlobalParamList';
import useAppStore from '../../../appearance/store/store';
import SelectThemeFontAlert from './components/SelectThemeFontAlert';
import SelectThemeModeAlert from './components/SelectThemeModeAlert';

export default function AppearanceScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'Appearance'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { showAlert } = useAlerts();
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

  const onPressFont = async () => {
    await showAlert({
      type: 'Custom',
      content: () => <SelectThemeFontAlert />,
      btn: {
        confirmBtnTitle: 'Close',
      },
    });
  };

  const onPressDarkTheme = async () => {
    await showAlert({
      type: 'Custom',
      content: () => <SelectThemeModeAlert />,
      btn: {
        confirmBtnTitle: 'Close',
      },
    });
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
          onPress={onPressFont}>
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
          onPress={onPressDarkTheme}>
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
