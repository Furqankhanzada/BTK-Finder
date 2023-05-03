import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme, FontSupport } from '@config';
import { Icon, Text } from '@components';

import useAppStore from '../../../../store/appStore';
import { saveFont } from '../../../../services/storage/AsyncStorage';
import { Font } from '../../../../store/models/appStore';

export default function SelectThemeFontAlert() {
  const { font, setFont } = useAppStore();
  const { colors } = useTheme();

  const onSelect = (item: Font) => {
    setFont(item);
    saveFont(item);
  };

  const getFont = (selectedFont: string) => {
    switch (selectedFont) {
      case Font.Raleway:
        return Font.Raleway;
      case Font.Roboto:
        return Font.Roboto;
      case Font.Merriweather:
        return Font.Merriweather;
      default:
        return Font.Raleway;
    }
  };

  return (
    <View style={styles.container}>
      {FontSupport.map((item, index) => {
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.item,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                borderBottomColor: colors.border,
                borderBottomWidth: index === FontSupport.length - 1 ? 0 : 1,
              },
            ]}
            onPress={() => onSelect(getFont(item))}>
            <View style={styles.itemContent}>
              <Text body1 style={styles.itemText}>
                {item}
              </Text>
            </View>
            {item === font && (
              <Icon name="check" size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        );
      })}
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
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginHorizontal: 8,
  },
});
