import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, FontSupport } from '@config';
import { Icon, Text } from '@components';

import { saveFont } from '../../../../../apis/application';
import useAppStore from '../../../../../appearance/store/store';

export default function SelectFontOption() {
  const { font, setFont } = useAppStore();
  const { colors } = useTheme();

  // TODO: Change the item type to "FONT" once the "appearance-store" branch is merged. We have added font types in that branch
  const onSelect = (item: string) => {
    setFont(item);
    saveFont(item);
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
            onPress={() => onSelect(item)}>
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
