import React from 'react';
import { Placeholder, PlaceholderLine, Progressive } from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

export function HorizontalCategoriesPlaceholder() {
  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        <View style={styles.container}>
          <PlaceholderLine style={styles.placeholderLine} />
          <PlaceholderLine style={styles.text} />
        </View>
      </Placeholder>
    </View>
  );
}

export function HorizontalBusinessPlaceholder() {
  return (
    <View>
      <Placeholder Animation={Progressive}>
        <View>
          <PlaceholderLine style={styles.image} />
          <PlaceholderLine style={styles.name} />
          <View style={styles.innerContainer}>
            <PlaceholderLine style={styles.ratingFigure} />
            <PlaceholderLine style={styles.ratingStars} />
          </View>
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
  mainContainer: {
    paddingLeft: 20,
    paddingRight: 20,
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
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  name: {
    width: 55,
    height: 10,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 5,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginRight: 15,
  },
  ratingFigure: {
    width: 25,
    height: 18,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  ratingStars: {
    width: 55,
    height: 5,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,
  },
});
