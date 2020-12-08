import React, { Fragment, useState, useRef } from 'react';
import { View, Platform, I18nManager, TouchableOpacity } from 'react-native';
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
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import DropDownPicker from 'react-native-dropdown-picker';
import { generalFormValidation } from './Validations';
import { Formik } from 'formik';
import GlobalStyle from '../../assets/styling/GlobalStyle';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function Business({ navigation }) {
  const formRef = useRef();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onNext = () => {
    navigation.navigate('Address');
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleConfirm = (date, setFieldValue) => {
    setFieldValue('established', date);
    toggleDatePicker();
  };

  const categories = useSelector((state) => state.categories.all);
  const getCategories = categories.map(({ name }) => {
    return { label: name, value: name };
  });
  const { colors } = useTheme();
  const cardColor = colors.card;

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const submit = (values) => {
    console.log('values', values);
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header title="Add Your Business" />
      <CustomStepIndicator position={0} />
      <Formik
        ref={formRef}
        onSubmit={(values) => submit(values)}
        initialValues={{}}
        validationSchema={generalFormValidation}>
        {({ handleChange, values, handleSubmit, errors, setFieldValue }) => {
          return (
            <Fragment>
              <ScrollView
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                keyboardVerticalOffset={offsetKeyboard}
                style={{ flex: 1 }}>
                <View style={styles.contain}>
                  <View style={styles.title}>
                    <Text title3 semibold>
                      General
                    </Text>
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      placeholder="Name"
                      onChangeText={handleChange('name')}
                      value={values.name}
                    />
                    {errors.name ? (
                      <Text style={GlobalStyle.errorText}>{errors.name}</Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      style={{ marginTop: 10 }}
                      onChangeText={handleChange('description')}
                      placeholder="Description"
                      value={values.description}
                    />
                    {errors.description ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.description}
                      </Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <DropDownPicker
                      items={getCategories}
                      containerStyle={{
                        marginTop: 10,
                        height: 48,
                        width: '100%',
                      }}
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
                      searchable={true}
                      searchableStyle={{ borderColor: colors.primary }}
                      searchablePlaceholder="Search for a Category"
                      searchablePlaceholderTextColor={BaseColor.grayColor}
                      dropDownStyle={{ backgroundColor: cardColor }}
                      dropDownMaxHeight={250}
                      onChangeItem={(item) =>
                        setFieldValue('category', item.value)
                      }
                    />
                    {errors.category ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.category}
                      </Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      style={{ marginTop: 10 }}
                      onChangeText={handleChange('tags')}
                      placeholder="Tags"
                      value={values.tags}
                    />
                    {errors.tags ? (
                      <Text style={GlobalStyle.errorText}>{errors.tags}</Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      style={{ marginTop: 10 }}
                      placeholder="Telephone"
                      onChangeText={handleChange('telephone')}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      value={values.telephone}
                    />
                    {errors.telephone ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.telephone}
                      </Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      style={{ marginTop: 10 }}
                      placeholder="Email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      autoCorrect={false}
                      autoCapitalize="none"
                      autoCompleteType="email"
                      onChangeText={handleChange('email')}
                      value={values.email}
                    />
                    {errors.email ? (
                      <Text style={GlobalStyle.errorText}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      style={{ marginTop: 10 }}
                      onChangeText={handleChange('website')}
                      placeholder="https://yoursite.com"
                      value={values.website}
                    />
                    {errors.website ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.website}
                      </Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TouchableOpacity
                      onPress={() => toggleDatePicker()}
                      style={GlobalStyle.datePickerContainer}>
                      <Text style={GlobalStyle.datePickerContainerText}>
                        {values.established
                          ? moment(values.established).format('DD/MM/YYYY')
                          : 'Established Date [YYYY/MM/DD]'}
                      </Text>
                    </TouchableOpacity>
                    {errors.established ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.established}
                      </Text>
                    ) : null}
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
                    enableRTL={true}
                  />
                }
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => handleConfirm(date, setFieldValue)}
                onCancel={toggleDatePicker}
              />
            </Fragment>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}