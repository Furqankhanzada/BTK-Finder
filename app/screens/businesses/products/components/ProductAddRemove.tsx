import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BaseColor } from '@config';

const ProductAddRemove = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prevCount) => prevCount + 1);
  const decrement = () => setCount((prevCount) => prevCount - 1);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: BaseColor.dividerColor }]}>
        <Text
          style={[styles.text, { borderColor: BaseColor.grayColor }]}
          onPress={increment}>
          +
        </Text>
        <Text style={[styles.text, { borderColor: BaseColor.grayColor }]}>
          {count}
        </Text>
        <Text
          style={[styles.text, { borderColor: BaseColor.grayColor }]}
          onPress={decrement}>
          -
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductAddRemove;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    borderWidth: 2,
    width: 50,
    textAlign: 'center',
  },
});
