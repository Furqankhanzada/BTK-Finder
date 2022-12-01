import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  color: string;
  text: string;
}

const Label = (props: Props) => {
  return (
    <View style={[styles.root, { backgroundColor: props.color }]}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});

export default memo(Label);