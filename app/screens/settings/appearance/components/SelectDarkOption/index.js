import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { SafeAreaView, Icon, Text } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { saveThemeMode } from '../../../../../apis/application';
import useAppStore from '../../../../../appearance/store/store';

export default function SelectDarkOption({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { themeMode, setThemeMode } = useAppStore();

  const onClose = () => {
    saveThemeMode(themeMode);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <View style={styles.contain}>
        <View style={[styles.contentModal, { backgroundColor: colors.card }]}>
          <View style={{ padding: 8 }}>
            <TouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => setThemeMode('dynamic')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text body1 style={{ marginHorizontal: 8 }}>
                  {t('dynamic_system')}
                </Text>
              </View>
              {themeMode === 'dynamic' && (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => setThemeMode('dark')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text body1 style={{ marginHorizontal: 8 }}>
                  {t('always_on')}
                </Text>
              </View>
              {themeMode === 'dark' && (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => setThemeMode('light')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text body1 style={{ marginHorizontal: 8 }}>
                  {t('always_off')}
                </Text>
              </View>
              {themeMode === 'light' && (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.contentAction}>
            <TouchableOpacity style={{ padding: 8 }} onPress={onClose}>
              <Text body1 primaryColor>
                {t('Close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
