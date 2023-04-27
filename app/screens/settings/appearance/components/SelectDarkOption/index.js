import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { SafeAreaView, Icon, Text } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { saveThemeMode } from '../../../../../apis/application';
import useAppStore from '../../../../../store/appStore';

export default function SelectDarkOption({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { themeMode, setThemeMode } = useAppStore();
  const [mode, setMode] = useState(themeMode);

  const onChange = (thememode) => {
    saveThemeMode(thememode);
    setThemeMode(thememode);
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
              onPress={() => setMode('dynamic')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text body1 style={{ marginHorizontal: 8 }}>
                  {t('dynamic_system')}
                </Text>
              </View>
              {mode === 'dynamic' && (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => setMode('dark')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text body1 style={{ marginHorizontal: 8 }}>
                  {t('always_on')}
                </Text>
              </View>
              {mode === 'dark' && (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => setMode('light')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text body1 style={{ marginHorizontal: 8 }}>
                  {t('always_off')}
                </Text>
              </View>
              {mode === 'light' && (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.contentAction}>
            <TouchableOpacity
              style={{ padding: 8, marginHorizontal: 24 }}
              onPress={() => navigation.goBack()}>
              <Text body1 grayColor>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => onChange(mode)}>
              <Text body1 primaryColor>
                {t('apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
