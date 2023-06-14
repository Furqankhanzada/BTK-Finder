import React from 'react';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Progressive,
} from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export default function CategoryPlaceholder() {
  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        <View>
          <View style={styles.subContainer}>
            <PlaceholderMedia style={styles.mediaPlaceholder} />
            <View style={styles.innerContainer}>
              <PlaceholderLine style={styles.topPlaceholderLine} />
              <PlaceholderLine style={styles.bottomPlaceholderLine} />
              <View style={styles.placeHolderLines}>
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.sizePlaceholderLine} />
              </View>
            </View>
          </View>
          <View style={styles.subContainer}>
            <PlaceholderMedia style={styles.mediaPlaceholder} />
            <View style={styles.innerContainer}>
              <PlaceholderLine style={styles.topPlaceholderLine} />
              <PlaceholderLine style={styles.bottomPlaceholderLine} />
              <View style={styles.placeHolderLines}>
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.sizePlaceholderLine} />
              </View>
            </View>
          </View>
          <View style={styles.subContainer}>
            <PlaceholderMedia style={styles.mediaPlaceholder} />
            <View style={styles.innerContainer}>
              <PlaceholderLine style={styles.topPlaceholderLine} />
              <PlaceholderLine style={styles.bottomPlaceholderLine} />
              <View style={styles.placeHolderLines}>
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.sizePlaceholderLine} />
                <PlaceholderLine style={styles.sizePlaceholderLine} />
              </View>
            </View>
          </View>
        </View>
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaPlaceholder: {
    width: 95,
    height: 95,
    borderRadius: 10,
  },
  topPlaceholderLine: {
    width: '30%',
    height: 15,
    marginTop: 15,
    marginLeft: 10,
  },
  bottomPlaceholderLine: {
    width: '45%',
    height: 8,
    marginTop: 3,
    marginLeft: 10,
  },
  sizePlaceholderLine: {
    width: '12%',
    height: 9,
    marginTop: 3,
    marginLeft: 10,
  },
  container: {
    flexDirection: 'row',
  },
  subContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  innerContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  mainContainer: {
    marginTop: 10,
  },
  placeHolderLines: {
    display: 'flex',
    flexDirection: 'row',
  },
});
