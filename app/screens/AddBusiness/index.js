import React, { useState } from 'react';
import { View, Platform, I18nManager } from 'react-native';
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
import { useSelector } from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Business({ navigation }) {

  const onNext = () => {
    navigation.navigate('Address');
  };

  const categories = useSelector((state) => state.categories.all);
  const getCategories = categories.map(({ name }) => {
    return { label: name, value: name }
  });
  const {colors} = useTheme();
  const cardColor = colors.card;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [established, setEstablished] = useState('');

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
            onChangeText={(text) => setName(text)}
            placeholder="Name"
            value={name}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setDescription(text)}
            placeholder="Description"
            value={description}
          />
          <DropDownPicker
              items={getCategories}
              defaultValue={category}
              containerStyle={{marginTop: 10, height: 48, width: '100%'}}
              style={{
                backgroundColor: cardColor,
                fontFamily: 'Raleway',
                flex: 1,
                height: '100%',
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: colors.text,
                paddingTop: 5,
                paddingBottom: 5,
                borderColor: cardColor,
              }}
              arrowColor={colors.primary}
              itemStyle={{ justifyContent: 'flex-start' }}
              placeholder="Select a Category"
              // placeholderStyle={{color: BaseColor.grayColor}}
              searchable={true}
              searchableStyle={{borderColor: colors.primary}}
              searchablePlaceholder="Search for a Category"
              searchablePlaceholderTextColor={BaseColor.grayColor}
              dropDownStyle={{backgroundColor: cardColor}}
              dropDownMaxHeight={250}
              onChangeItem={item =>setCategory(item.value)}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setTags(text)}
            placeholder="Tags"
            value={tags}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setTelephone(text)}
            placeholder="Telephone"
            keyboardType="numeric"
            autoCapitalize="none"
            value={telephone}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            autoCompleteType="email"
            value={email}
          />
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(text) => setWebsite(text)}
            placeholder="https://yoursite.com"
            value={website}
          />
          <TextInputMask
            style={[BaseStyle.textInput, { backgroundColor: cardColor, color: colors.text, marginTop:10 }]}
            refInput={(ref) => {
              this.input = ref;
            }}
            onChangeText={(text) => setEstablished(text)}
            placeholder="Established Date [YYYY/MM/DD]"
            placeholderTextColor={BaseColor.grayColor}
            keyboardType="numeric"
            value={established}
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
