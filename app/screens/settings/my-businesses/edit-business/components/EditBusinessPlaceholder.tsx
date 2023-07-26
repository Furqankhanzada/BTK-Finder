import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export function EditBusinessPlaceholder() {
  const items = Array(12).fill({});

  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        {items.map((item, index) => (
          <View style={styles.linesContainer} key={index}>
            <PlaceholderLine style={styles.headingLine} />
            <PlaceholderLine
              style={[
                styles.textLine,
                { width: Math.floor(Math.random() * 100) + 100 },
              ]}
            />
          </View>
        ))}
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingTop: 70,
  },
  linesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headingLine: {
    height: 25,
    marginBottom: 10,
    width: '25%',
  },
  textLine: {
    height: 15,
    marginBottom: 20,
    width: '50%',
  },
});
