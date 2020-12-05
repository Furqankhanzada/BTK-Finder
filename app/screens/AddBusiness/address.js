import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { BaseStyle } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Text,
  CustomStepIndicator,
} from '@components';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';

export default function Address({ navigation }) {

  const onNext = () => {
    navigation.navigate('Hours');
  };

  const [street, setStreet] = useState('');

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={'Add Your Business'}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <CustomStepIndicator position={1} />
      <ScrollView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.contain}>
          <View style={styles.title}>
            <Text title3 semibold>
              Address
            </Text>
          </View>
          <View>
            <TextInput
              style={{ marginTop: 10, height: 100 }}
              onChangeText={(text) => setStreet(text)}
              placeholder="Address"
              value={street}
              multiline={true}
              numberOfLines={10}
              textAlignVertical= 'top'
            />
          </View>
        </View>
      </ScrollView>
      <ActionButton
        buttonColor="rgba(93, 173, 226, 1)"
        onPress={() => onNext()}
        offsetX={20}
        offsetY={10}
        icon={
          <Icon
          name="arrow-right"
          size={20}
          color="white"
          enableRTL={true} />
        }
      />
    </SafeAreaView>
  );
}