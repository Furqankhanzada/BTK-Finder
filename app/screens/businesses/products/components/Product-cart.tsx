import { Button } from '@components';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BaseColor } from '@config';

const ProductCurt = () => {
  return (
    <View style={styles.mainContainer}>
      <Button>
        <View style={styles.innerContainer}>
          <View style={styles.width}>
            <Text style={[styles.cartAmount, { color: BaseColor.whiteColor }]}>
              Rs.1000
            </Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.cartText, { color: BaseColor.whiteColor }]}>
              Add to cart
            </Text>
          </View>
          <View style={styles.width}>
            <Text
              style={[
                styles.cartQuantity,
                { backgroundColor: BaseColor.whiteColor },
              ]}>
              3
            </Text>
          </View>
        </View>
      </Button>
    </View>
  );
};

export default ProductCurt;

const styles = StyleSheet.create({
  width: {
    width: 80,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  subContainer: {
    width: 150,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  cartText: {
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cartQuantity: {
    fontSize: 18,
    textAlign: 'center',
    width: 30,
    height: 28,
    borderRadius: 5,
  },
  cartAmount: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
