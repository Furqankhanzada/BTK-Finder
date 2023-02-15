import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export function NotificationListPlaceholder() {
  const items = Array(8).fill({});

  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        {items.map(() => (
          <View style={styles.itemContainer}>
            <PlaceholderLine style={styles.image} />
            <View style={styles.textContainer}>
              <PlaceholderLine style={styles.headingLine} />
              <PlaceholderLine style={styles.textLine} />
              <PlaceholderLine style={styles.subtextLine} />
            </View>
          </View>
        ))}
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 11,
  },
  headingLine: {
    height: 15,
    marginBottom: 10,
    width: 100,
  },
  textLine: {
    height: 12,
    marginBottom: 10,
    width: 200,
  },
  subtextLine: {
    height: 10,
    marginBottom: 10,
    width: 50,
  },
});
