import React from 'react';
import { View } from 'react-native';
import {
  Header,
  SafeAreaView,
  Icon,
  CustomStepIndicator,
} from '@components';
import ActionButton from 'react-native-action-button';

export default function FinalReview({ navigation }) {
  
  const onCofirm = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
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
        <CustomStepIndicator position={4} />
        <ActionButton
          buttonColor="rgba(93, 173, 226, 1)"
          onPress={() => onCofirm()}
          offsetX={20}
          offsetY={10}
          icon={
            <Icon
            name="check"
            size={20}
            color="white"
            enableRTL={true} />
          }
        />
      </SafeAreaView>
    </View>
  );
}