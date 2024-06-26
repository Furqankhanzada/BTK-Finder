import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@config';
import { Icon, Text } from '@components';

import useAppStore from '../../../../store/appStore';
import { saveThemeMode } from '../../../../services/storage/AsyncStorage';
import { ThemeMode } from '../../../../store/models/appStore';

export default function SelectThemeModeAlert() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { themeMode, setThemeMode } = useAppStore();

  const onSelectThemeMode = (thememode: ThemeMode) => {
    setThemeMode(thememode);
    saveThemeMode(thememode);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.item, { borderBottomColor: colors.border }]}
        onPress={() => onSelectThemeMode(ThemeMode.dynamic)}>
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
        onPress={() => onSelectThemeMode(ThemeMode.dark)}>
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
        onPress={() => onSelectThemeMode(ThemeMode.light)}>
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
