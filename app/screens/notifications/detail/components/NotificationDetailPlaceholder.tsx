import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export function NotificationDetailPlaceholder() {
  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        <PlaceholderLine style={styles.image} />
        <View style={styles.titleContainer}>
          <PlaceholderLine style={styles.line} />
        </View>
        <View style={styles.descriptionContainer}>
          <PlaceholderLine style={styles.fullLine} />
          <PlaceholderLine style={styles.threeQuarterLine} />
          <PlaceholderLine style={styles.line} />
          <PlaceholderLine style={styles.fullLine} />
        </View>
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  titleContainer: {
    marginTop: 10,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  line: {
    width: '60%',
    height: 20,
    marginTop: 2,
    borderRadius: 5,
  },
  fullLine: {
    width: '100%',
    height: 20,
    marginTop: 2,
    borderRadius: 5,
  },
  threeQuarterLine: {
    width: '75%',
    height: 20,
    marginTop: 2,
    borderRadius: 5,
  },
});
