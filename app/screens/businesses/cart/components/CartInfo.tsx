import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '@components';
import { useTheme } from '@config';

interface Props {
  subtotal: string;
  shipping: string;
  total: string;
}

export default function (props: Props) {
  const { subtotal, shipping, total } = props;
  const { colors } = useTheme();

  return (
    <View style={[styles.infoBox, { borderColor: colors.primary }]}>
      <View style={styles.infoTextContainer}>
        <Text body2>Subtotal</Text>
        <Text body2>Rs {subtotal}</Text>
      </View>

      <View style={styles.infoTextContainer}>
        <Text body2>Shipping</Text>
        <Text body2>Rs {shipping}</Text>
      </View>

      <View style={styles.infoTextContainer}>
        <Text body2>Total</Text>
        <Text body2>Rs {total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
  },
  infoTextContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5,
  },
});
