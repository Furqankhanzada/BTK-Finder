import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';

import * as Utils from '@utils';

export function MyBusinessesPlaceholder() {
  const items = Array(6).fill({});

  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        {items.map((item, index) => (
          <View style={styles.palceholderWrapper} key={index}>
            <PlaceholderLine style={styles.thumbnail} />
            <View>
              <PlaceholderLine
                style={[
                  styles.textLine,
                  { width: Math.floor(Math.random() * 100) + 100 },
                ]}
              />
              <PlaceholderLine
                style={[
                  styles.textLine,
                  { width: Math.floor(Math.random() * 100) + 100 },
                ]}
              />
              <PlaceholderLine
                style={[
                  styles.textLine,
                  { width: Math.floor(Math.random() * 100) + 100 },
                ]}
              />
            </View>
          </View>
        ))}
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
  },
  palceholderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: Utils.scaleWithPixel(80),
    height: Utils.scaleWithPixel(80),
    borderRadius: 8,
    marginBottom: 15,
  },
  textLine: {
    height: 15,
    marginBottom: 10,
    marginLeft: 10,
    width: '50%',
  },
});
