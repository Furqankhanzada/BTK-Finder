import React, { useRef } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

export const AddBusinessScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <FlatList
        style={styles.container}
        overScrollMode={'never'}
        scrollEventThrottle={16}
        ListHeaderComponent={<Header title="Add Business" />}
        ListHeaderComponentStyle={{ backgroundColor: 'white' }}
        ListFooterComponent={
          <View style={styles.navButtons}>
            <Button round>{'Next'}</Button>
            <Button round>{'Next'}</Button>
          </View>
        }
        ListFooterComponentStyle={{ paddingTop: 265 }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ],
          {
            useNativeDriver: false,
          },
        )}
        data={[1]}
        renderItem={() => {
          return (
            <View>
              <Text title1 bold>
                What is your Business name ?
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Business name"
                onChangeText={function (text: string): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  input: {
    marginTop: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
  },
  navButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
});
