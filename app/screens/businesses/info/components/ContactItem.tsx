import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, Text } from '@components';
import { BaseColor, useTheme } from '@config';

export default function ContactItem({ item, onPress }: any) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.line}
      key={item.id}
      onPress={() => onPress(item)}>
      <View style={[styles.contentIcon, { backgroundColor: colors.border }]}>
        <Icon name={item.icon} size={16} color={BaseColor.whiteColor} />
      </View>
      <View
        style={{
          marginLeft: 10,
          flexDirection: 'column',
          flex: 1,
        }}>
        <Text caption2 grayColor>
          {item.title}
        </Text>
        <Text footnote semibold style={{ marginTop: 5 }}>
          {item.information}
        </Text>
      </View>
      <View>
        <Text caption1 semibold style={{ color: colors.primary }}>
          {item.rightText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
