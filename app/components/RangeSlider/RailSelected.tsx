import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  color: string;
}

const RailSelected = (props: Props) => {
  return <View style={[styles.root, { backgroundColor: props.color }]} />;
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 6,
    borderRadius: 2,
  },
});
