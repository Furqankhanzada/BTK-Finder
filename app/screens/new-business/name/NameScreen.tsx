import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Formik } from 'formik';

import { Header, Text, TextInput, Button } from '@components';
import { BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { MainStackParamList } from '../../../navigation/models/MainStackParamList';

interface Props {
  navigation: any;
}

export const NameScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [inputValue, setInputValue] = useState<any>();

  const scrollY = useRef(new Animated.Value(0)).current;

  const navigateToNewBusiness = () => {
    navigation.navigate('Discription');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Formik
        initialValues={{ title: '' }}
        onSubmit={(values) => {
          console.log('Formik Values', values);
        }}>
        {(props) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                ListHeaderComponent={<Header title="Add Business" />}
                ListHeaderComponentStyle={{ backgroundColor: 'white' }}
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
                        placeholder="Business name ?"
                        value={inputValue}
                        onChangeText={setInputValue}
                        // onChangeText={event => setInputValue(event.target.value)}
                      />
                    </View>
                  );
                }}
              />
              {inputValue?.length >= 3 ? (
                <View style={styles.stickyFooter}>
                  <Button>{'Back'}</Button>
                  <Button onPress={() => navigateToNewBusiness()}>
                    {'Next'}
                  </Button>
                </View>
              ) : null}
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    // backgroundColor: 'green',
  },
  input: {
    marginTop: 15,
  },
  stickyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
});
