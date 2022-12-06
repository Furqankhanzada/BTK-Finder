import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@components';
import { BaseColor, useTheme } from '@config';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  quantity: number;
  onPressAdd: () => void;
  onPressRemove: () => void;
  small?: boolean;
}
export default function QuantityButton({
  quantity,
  onPressAdd,
  onPressRemove,
  small,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryLight }]}>
      <TouchableOpacity onPress={onPressAdd} style={styles.button}>
        <Icon name="add" size={small ? 12 : 24} color={BaseColor.whiteColor} />
      </TouchableOpacity>
      <Text
        title3
        style={[
          { color: BaseColor.whiteColor },
          small && styles.quantityTextSmall,
        ]}>
        {quantity}
      </Text>
      <TouchableOpacity onPress={onPressRemove} style={styles.button}>
        <Icon
          name="remove"
          size={small ? 12 : 24}
          color={BaseColor.whiteColor}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  button: {
    padding: 8,
  },
  quantityTextSmall: {
    fontSize: 12,
  },
});
