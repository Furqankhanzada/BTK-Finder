import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export default function CategoryPlaceholder() {
  return (
    <View>
      <Placeholder Animation={Progressive}>
        <View style={styles.container}>
          <View>
            <PlaceholderLine style={styles.placeholderLine} />
          </View>
          <View>
            <PlaceholderLine style={styles.placeholderLine} />
          </View>
          <View>
            <PlaceholderLine style={styles.placeholderLine} />
          </View>
          <View>
            <PlaceholderLine style={styles.placeholderLine} />
          </View>
        </View>
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderLine: {
    width: 80,
    height: 32,
    marginRight: 18,
    marginBottom: 10,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});
