import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export default function CategoryPlaceholder() {
  return (
    <View>
      <Placeholder Animation={Progressive}>
        <View style={styles.container}>
          <PlaceholderLine style={styles.placeholderLine} />
        </View>
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderLine: {
    width: 80,
    height: 32,
    marginRight: 5,
    marginBottom: 0,
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});
