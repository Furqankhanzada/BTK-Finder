import React, { Fragment, useState, useRef, useEffect } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  TextInput,
  Text,
  CustomStepIndicator,
} from '@components';
import styles from './styles';
import remoteConfig from '@react-native-firebase/remote-config';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import {
  MultiselectDropdown,
  Dropdown,
} from '../../modules/sharingan-rn-modal-dropdown-master/src';
import { generalFormValidation } from './Validations';
import { Formik } from 'formik';
import GlobalStyle from '../../assets/styling/GlobalStyle';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { setBusinessFormData } from '../../actions/business';

export default function Business({ navigation }) {
  const description = useRef(null);
  const telephone = useRef(null);
  const email = useRef(null);
  const website = useRef(null);

  const formRef = useRef();
  const dispatch = useDispatch();
  const stateProps = useSelector(({ categories, businesses }) => {
    return {
      categories: categories.all,
      businesses,
    };
  });
  const { businessFormData } = stateProps.businesses;

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

  const getCategories = stateProps.categories.map(({ name }) => {
    return { label: name, value: name };
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const onUpdateTags = (value) => {
    setSelectedTags(value);
    // console.log('########################', value);
  };
  const [tags, setTags] = useState([]);

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const onUpdateFacilities = (value) => {
    setSelectedFacilities(value);
    // console.log('########################', value);
  };
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    // console.log('GET FACILITIES', getFacilities._value);
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);
  useEffect(() => {
    const getTags = remoteConfig().getValue('tags');
    // console.log('GET TAGS', getTags._value);
    getTags ? setTags(JSON.parse(getTags._value)) : null;
  }, []);

  const getSelectedCategory = (selected) => {
    let foundCategory = null;
    if (stateProps.categories && stateProps.categories.length) {
      foundCategory = stateProps.categories.find(
        (obj) => obj.name === selected,
      );
    }
    return foundCategory ? foundCategory.name : '';
  };

  const { colors } = useTheme();
  const cardColor = colors.card;

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const submit = (values) => {
    dispatch(
      setBusinessFormData({
        ...values,
        tags: selectedTags.map((el) => el.name),
        facilities: selectedFacilities,
      }),
    );
    onNext();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header title="Add Your Business" />
      <CustomStepIndicator position={0} />
      <Formik
        ref={formRef}
        onSubmit={(values) => submit(values)}
        initialValues={{
          name: businessFormData.name ? businessFormData.name : '',
          description: businessFormData.description
            ? businessFormData.description
            : '',
          telephone: businessFormData.telephone
            ? businessFormData.telephone
            : '',
          website: businessFormData.website ? businessFormData.website : '',
          email: businessFormData.email ? businessFormData.email : '',
          established: businessFormData.established
            ? businessFormData.established
            : '',
          category: businessFormData.category
            ? getSelectedCategory(businessFormData.category)
            : '',
        }}
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
                      onSubmitEditing={() => description.current.focus()}
                    />
                    {errors.name ? (
                      <Text style={GlobalStyle.errorText}>{errors.name}</Text>
                    ) : null}
                  </View>

                  <View style={[GlobalStyle.inputContainer, { marginTop: 10 }]}>
                    <TextInput
                      ref={description}
                      style={styles.textArea}
                      placeholder="Description"
                      onChangeText={handleChange('description')}
                      value={values.description}
                      multiline={true}
                      numberOfLines={10}
                      textAlignVertical="top"
                    />
                    {errors.description ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.description}
                      </Text>
                    ) : null}
                  </View>

                  <View style={[GlobalStyle.inputContainer, { marginTop: 10 }]}>
                    <Dropdown
                      label=""
                      data={getCategories}
                      value={values.category}
                      floating
                      elevation={0}
                      borderRadius={7}
                      dropdownTitleColor={colors.text}
                      itemTextStyle={{ color: colors.text }}
                      selectedItemTextStyle={{ color: colors.primary }}
                      parentDDContainerStyle={{
                        marginTop: 70,
                        backgroundColor: colors.card,
                        borderColor: BaseColor.grayColor,
                        borderWidth: 1,
                      }}
                      mainContainerStyle={{
                        backgroundColor: colors.card,
                        borderRadius: 5,
                      }}
                      underlineColor="transparent"
                      onChange={(item) => setFieldValue('category', item)}
                    />
                    {errors.category ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.category}
                      </Text>
                    ) : null}
                  </View>

                  <View
                    style={[
                      GlobalStyle.inputContainer,
                      { marginTop: 10, marginBottom: -15 },
                    ]}>
                    <MultiselectDropdown
                      label=""
                      title="Facilities"
                      titleColor={
                        selectedFacilities?.length
                          ? colors.text
                          : BaseColor.grayColor
                      }
                      data={facilities}
                      enableSearch
                      enableAvatar
                      floating
                      elevation={0}
                      borderRadius={7}
                      searchPlaceholder="Search for a facility"
                      emptyListText="No facility found"
                      itemTextStyle={{ color: colors.text }} //dropdown text unselected
                      selectedItemTextStyle={{ color: colors.primary }} //dropdown text selected
                      underlineColor="transparent"
                      parentDDContainerStyle={{
                        marginTop: 70,
                        backgroundColor: colors.card,
                        borderColor: BaseColor.grayColor,
                        borderWidth: 1,
                      }} //Dropdown Container Style
                      mainContainerStyle={{
                        backgroundColor: colors.card,
                        borderRadius: 5,
                      }}
                      chipType="outlined"
                      chipTextStyle={{ color: colors.text }}
                      chipStyle={{
                        marginBottom: 10,
                        borderColor: colors.primary,
                      }}
                      emptySelectionText="Selected Facilities will appear here.."
                      emptySelectionTextStyle={{ color: colors.text }}
                      value={selectedFacilities}
                      onChange={onUpdateFacilities}
                    />
                  </View>

                  <View
                    style={[
                      GlobalStyle.inputContainer,
                      { marginTop: 10, marginBottom: -15 },
                    ]}>
                    <MultiselectDropdown
                      label=""
                      title="Tags"
                      titleColor={
                        selectedTags?.length ? colors.text : BaseColor.grayColor
                      }
                      data={tags}
                      enableSearch
                      floating
                      elevation={0}
                      borderRadius={7}
                      searchPlaceholder="Search for a tag"
                      emptyListText="No Tag found"
                      itemTextStyle={{ color: colors.text }} //dropdown text unselected
                      selectedItemTextStyle={{ color: colors.primary }} //dropdown text selected
                      underlineColor="transparent"
                      parentDDContainerStyle={{
                        marginTop: 70,
                        backgroundColor: colors.card,
                        borderColor: BaseColor.grayColor,
                        borderWidth: 1,
                      }} //Dropdown Container Style
                      mainContainerStyle={{
                        backgroundColor: colors.card,
                        borderRadius: 5,
                      }}
                      chipType="outlined"
                      chipTextStyle={{ color: colors.text }}
                      chipStyle={{
                        marginBottom: 10,
                        borderColor: colors.primary,
                      }}
                      emptySelectionText="Selected Tags will appear here.."
                      emptySelectionTextStyle={{ color: colors.text }}
                      value={selectedTags}
                      onChange={onUpdateTags}
                    />
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      ref={telephone}
                      style={{ marginTop: 10 }}
                      placeholder="Telephone"
                      onChangeText={handleChange('telephone')}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      value={values.telephone}
                      onSubmitEditing={() => email.current.focus()}
                    />
                    {errors.telephone ? (
                      <Text style={GlobalStyle.errorText}>
                        {errors.telephone}
                      </Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      ref={email}
                      style={{ marginTop: 10 }}
                      placeholder="Email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      autoCorrect={false}
                      autoCapitalize="none"
                      autoCompleteType="email"
                      onChangeText={handleChange('email')}
                      value={values.email}
                      onSubmitEditing={() => website.current.focus()}
                    />
                    {errors.email ? (
                      <Text style={GlobalStyle.errorText}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <View style={GlobalStyle.inputContainer}>
                    <TextInput
                      ref={website}
                      style={{ marginTop: 10 }}
                      onChangeText={handleChange('website')}
                      placeholder="https://yoursite.com"
                      value={values.website}
                      onSubmitEditing={() => toggleDatePicker()}
                      returnKeyType="done"
                      blurOnSubmit={true}
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
                      style={[
                        GlobalStyle.datePickerContainer,
                        { backgroundColor: cardColor, color: colors.text },
                      ]}>
                      <Text
                        style={[
                          GlobalStyle.datePickerContainerText,
                          {
                            color: values.established
                              ? colors.text
                              : BaseColor.grayColor,
                          },
                        ]}>
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
                buttonColor={colors.primary}
                nativeFeedbackRippleColor="transparent"
                onPress={() => handleSubmit()}
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
