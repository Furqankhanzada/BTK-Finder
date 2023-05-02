import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@config';
import { Icon, Text } from '@components';
import { useTranslation } from 'react-i18next';

import { saveThemeMode } from '../../../../apis/application';
import useAppStore from '../../../../appearance/store/store';

export default function SelectThemeModeAlert() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { themeMode, setThemeMode } = useAppStore();

  // TODO: Change the thememode type to "THEME_MODES" after the "appearance-store" branch is merged. We have added thememode types in that branch
  const onSelectThemeMode = (thememode: 'light' | 'dark' | 'dynamic') => {
    setThemeMode(thememode);
    saveThemeMode(thememode);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.item, { borderBottomColor: colors.border }]}
        onPress={() => onSelectThemeMode('dynamic')}>
        <View style={styles.itemContent}>
          <Text body1 style={styles.itemText}>
            {t('dynamic_system')}
          </Text>
        </View>
        {themeMode === 'dynamic' && (
          <Icon name="check" size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, { borderBottomColor: colors.border }]}
        onPress={() => onSelectThemeMode('dark')}>
        <View style={styles.itemContent}>
          <Text body1 style={styles.itemText}>
            {t('always_on')}
          </Text>
        </View>
        {themeMode === 'dark' && (
          <Icon name="check" size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.item, { borderBottomWidth: 0 }]}
        onPress={() => onSelectThemeMode('light')}>
        <View style={styles.itemContent}>
          <Text body1 style={styles.itemText}>
            {t('always_off')}
          </Text>
        </View>
        {themeMode === 'light' && (
          <Icon name="check" size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginHorizontal: 8,
  },
});
