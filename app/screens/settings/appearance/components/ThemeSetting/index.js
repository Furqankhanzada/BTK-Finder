import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemeSupport } from '@config';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Button } from '@components';

import styles from './styles';
import { saveTheme } from '../../../../../apis/application';
import useAppStore from '../../../../../appearance/store/store';

export default function ThemeSetting({ navigation }) {
  const { theme } = useAppStore();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [themeSupport, setTheme] = useState(ThemeSupport);

  useEffect(() => {
    setTheme(
      themeSupport.map((item) => {
        return {
          ...item,
          selected: item.theme === theme,
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * call when select theme
   *
   * @param {*} selected
   */
  const onSelect = (selected) => {
    setTheme(
      themeSupport.map((item) => {
        return {
          ...item,
          selected: item.theme === selected.theme,
        };
      }),
    );
  };

  /**
   * call when save theme
   *
   */
  const changeTheme = () => {
    const list = themeSupport.filter((item) => item.selected);
    if (list.length > 0) {
      saveTheme(list[0].theme);
      StatusBar.setBackgroundColor(list[0].light.colors.primary, true);
    }
  };

  /**
   * render UI theme item
   *
   * @param {*} item
   * @returns
   */
  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.profileItem,
          { borderBottomColor: colors.border, borderBottomWidth: 1 },
        ]}
        onPress={() => onSelect(item)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 16,
              height: 16,
              backgroundColor: item.light.colors.primary,
            }}
          />
          <Text body1 style={{ marginHorizontal: 8 }}>
            {item.theme}
          </Text>
        </View>
        {item.selected && (
          <Icon name="check" size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('theme')}
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
      <FlatList
        contentContainerStyle={styles.contain}
        data={themeSupport}
        keyExtractor={(item, index) => item.theme}
        renderItem={({ item }) => renderItem(item)}
      />
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <Button full onPress={changeTheme}>
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
