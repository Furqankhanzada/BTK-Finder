import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '@components';
import { BaseColor, useTheme } from '@config';

interface Props {
  subtotal: string;
  shipping: string;
  total: string;
}

export default function (props: Props) {
  const { subtotal, shipping, total } = props;
  const { colors } = useTheme();

  return (
    <View style={styles.infoBox}>
      <View style={styles.infoTextContainer}>
        <Text body2 medium>
          Subtotal
        </Text>
        <Text body2 medium>
          Rs {subtotal}
        </Text>
      </View>

      <View style={styles.infoTextContainer}>
        <Text body2 grayColor medium>
          Shipping
        </Text>

        {shipping === '0' ? (
          <Text body2 style={{ color: BaseColor.greenColor }}>
            Free
          </Text>
        ) : (
          <Text body2>Rs {shipping}</Text>
        )}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.infoTextContainer}>
        <Text body1 medium>
          Total
        </Text>
        <Text body1 medium>
          Rs {total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  infoTextContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 5,
  },
});
