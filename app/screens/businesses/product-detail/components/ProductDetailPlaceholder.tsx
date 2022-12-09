import React from 'react';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Progressive,
} from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export default function ProductDetailPlaceholder() {
  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        <View>
          <View style={styles.subContainer}>
            <PlaceholderMedia style={styles.mediaPlaceholder} />
            <View style={styles.innerContainer}>
              <PlaceholderLine style={styles.topPlaceholderLine} />
              <View style={styles.productContainer}>
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.productButton} />
              </View>
            </View>
          </View>
          <View style={styles.qtyContainer}>
            <View style={styles.qtyInnerContainer}>
              <PlaceholderLine style={styles.qtyPlaceholderInnerLine} />
              <PlaceholderLine style={styles.qtyPlaceholderLine} />
            </View>
          </View>
        </View>
      </Placeholder>
      <View style={styles.eCommerceButtonContainer}>
        <Placeholder Animation={Progressive}>
          <PlaceholderLine style={styles.eCommercelaceholderLine} />
        </Placeholder>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 20,
    position: 'relative',
  },
  mediaPlaceholder: {
    width: '100%',
    height: 245,
    borderRadius: 10,
  },
  topPlaceholderLine: {
    width: '90%',
    height: 40,
    marginTop: 20,
    borderRadius: 5,
  },
  bottomPlaceholderLine: {
    width: '50%',
    height: 40,
    borderRadius: 5,
  },
  sizePlaceholderLine: {
    width: '25%',
    height: 14,
    marginTop: 35,
  },
  productButton: {
    width: '20%',
    height: 30,
  },
  container: {
    flexDirection: 'row',
  },
  subContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
  },
  qtyInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  qtyPlaceholderLine: {
    width: '58%',
    height: 40,
    marginTop: -5,
    borderRadius: 5,
  },
  qtyPlaceholderInnerLine: {
    width: '28%',
    height: 14,
    marginTop: 8,
    marginRight: 48,
  },
  productContainer: {
    display: 'flex',
  },
  eCommerceButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 10,
  },
  eCommercelaceholderLine: {
    width: '100%',
    height: 50,
    marginTop: -5,
    borderRadius: 5,
  },
});
