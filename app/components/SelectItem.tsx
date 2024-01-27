import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, Text } from './index';
import { useTheme } from '@config';

type Props = {
  onPress: () => void;
  icon?: string;
  checked?: boolean;
  text: string;
};

export const SelectItem = ({ onPress, icon, checked, text }: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: colors.card }]}
      onPress={onPress}>
      <View style={styles.itemContent}>
        <Icon
          name={icon}
          color={checked ? colors.primary : colors.text}
          style={styles.checkIcon}
          size={15}
        />
        <Text
          body1
          style={
            checked
              ? {
                  color: colors.primary,
                }
              : {}
          }>
          {text}
        </Text>
      </View>
      {checked && <Icon name="check" size={14} color={colors.primary} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 10,
  },
});
