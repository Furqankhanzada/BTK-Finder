import React from 'react';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Progressive,
} from 'rn-placeholder';
import { View, StyleSheet } from 'react-native';

const reapeatTimes = [1, 2, 3, 4, 5];

export default function CategoryPlaceholder() {
  return (
    <View style={styles.mainContainer}>
      <Placeholder Animation={Progressive}>
        {reapeatTimes.map((item) => {
          return (
            <View key={item} style={styles.subContainer}>
              <PlaceholderMedia style={styles.mediaPlaceholder} />
              <View style={styles.innerContainer}>
                <PlaceholderLine style={styles.topPlaceholderLine} />
                <PlaceholderLine style={styles.bottomPlaceholderLine} />
              </View>
            </View>
          );
        })}
      </Placeholder>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 0,
  },
  topPlaceholderLine: {
    width: '40%',
    height: 12,
    marginTop: 15,
    marginLeft: 10,
  },
  middlePlaceholderLine: {
    width: '20%',
    height: 8,
    marginLeft: 10,
  },
  bottomPlaceholderLine: {
    width: '60%',
    height: 6,
    marginTop: 6,
    marginLeft: 10,
  },
  container: {
    flexDirection: 'row',
  },
  subContainer: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  innerContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  mainContainer: {
    marginTop: 0,
  },
});
