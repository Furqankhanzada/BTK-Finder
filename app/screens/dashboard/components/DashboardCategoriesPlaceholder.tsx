import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export function HorizentalCategoriesPlaceholder() {
  return (
    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Placeholder Animation={Progressive}>
        <View style={styles.container}>
          <PlaceholderLine style={styles.placeholderLine} />
          <PlaceholderLine style={styles.text} />
        </View>
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderLine: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 8,
    marginRight: 4,
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    width: 36,
    height: 8,
    marginRight: 0,
    marginBottom: 0,
  },
});
