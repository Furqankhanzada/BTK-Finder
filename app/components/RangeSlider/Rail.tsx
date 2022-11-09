import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  color: string;
}

const Rail = (props: Props) => {
  return <View style={[styles.root, { backgroundColor: props.color }]} />;
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 6,
    borderRadius: 2,
  },
});
