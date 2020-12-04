import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Text,
  CustomStepIndicator,
} from '@components';
import styles from './styles';
import TextInputMask from 'react-native-text-input-mask';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';

export default function Business({ navigation }) {

  const onNext = () => {
    navigation.navigate('Address');
  };

  const {colors} = useTheme();
  const cardColor = colors.card;

  const [contactName, setContactName] = useState('');
  const [contactDescription, setContactDescription] = useState('');
  const [contactCategory, setContactCategory] = useState('');
  const [contactTags, setContactTags] = useState('');
  const [contactTelephone, setContactTelephone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [contactEstablished, setContactEstablished] = useState('');

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header title="Add Your Business" />
      <CustomStepIndicator position={0} />
      <ScrollView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1}}>
        <View style={styles.contain}>
          <View style={styles.title}>
            <Text title3 semibold>
              General
            </Text>
          </View>
          <TextInput
            onChangeText={(text) => setContactName(text)}
            placeholder="Name"
            value={contactName}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setContactDescription(text)}
            placeholder="Description"
            value={contactDescription}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setContactCategory(text)}
            placeholder="Category"
            value={contactCategory}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setContactTags(text)}
            placeholder="Tags"
            value={contactTags}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setContactTelephone(text)}
            placeholder="Telephone"
            keyboardType="numeric"
            autoCapitalize="none"
            value={contactTelephone}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setContactEmail(text)}
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            autoCompleteType="email"
            value={contactEmail}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setContactWebsite(text)}
            placeholder="https://yoursite.com"
            value={contactWebsite}
          />
          <TextInputMask
            style={[BaseStyle.textInput, { backgroundColor: cardColor, color: colors.text, marginTop:10 }]}
            refInput={(ref) => {
              this.input = ref;
            }}
            onChangeText={(text) => setContactEstablished(text)}
            placeholder="Established Date [YYYY/MM/DD]"
            placeholderTextColor={BaseColor.grayColor}
            keyboardType="numeric"
            value={contactEstablished}
            mask={'[0000]{-}[00]{-}[00]'}
          />
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
