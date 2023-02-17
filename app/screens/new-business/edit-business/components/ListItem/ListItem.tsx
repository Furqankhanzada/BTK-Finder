import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Icon, Text } from '@components';
import { useTheme } from '@config';

type Props = {
  title: string;
  text?: string;
  onPress: () => void;
};

export default function ListItem(props: Props) {
  const { colors } = useTheme();
  const { title, text, onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: colors.border }]}
      onPress={onPress}>
      <Text body1 semibold style={styles.title}>
        {title}
      </Text>
      <View style={styles.leftContainer}>
        <Text body1 numberOfLines={1}>
          {text ? text : ''}
        </Text>
        <Icon
          name="angle-right"
          size={18}
          color={colors.primary}
          style={styles.icon}
          enableRTL={true}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    width: '50%',
  },
  leftContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 5,
  },
});
