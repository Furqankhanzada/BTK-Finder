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
  DropDown,
} from '@components';
import styles from './styles';
import remoteConfig from '@react-native-firebase/remote-config';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import { MultiselectDropdown } from '../../modules/sharingan-rn-modal-dropdown-master/src';
import { generalFormValidation } from './Validations';
import { Formik } from 'formik';
import GlobalStyle from '../../assets/styling/GlobalStyle';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { setBusinessFormData } from '../../actions/business';

export default function Business({ navigation }) {
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
  const [tags] = useState([
    {
      label: 'Food',
      value: 'Food',
    },
    {
      label: 'Burger',
      value: 'Burger',
    },
    {
      label: 'Pizza',
      value: 'Pizza',
    },
    {
      label: 'Drink',
      value: 'Drink',
    },
    {
      label: 'Clothing',
      value: 'Clothing',
    },
    {
      label: 'Mens Cloth',
      value: 'Mens Cloth',
    },
    {
      label: 'Boys Cloth',
      value: 'Boys Cloth',
    },
    {
      label: 'Technician',
      value: 'Technician',
    },
    {
      label: 'School',
      value: 'School',
    },
    {
      label: 'College',
      value: 'College',
    },
    {
      label: 'University',
      value: 'University',
    },
    {
      label: 'Cinema',
      value: 'Cinema',
    },
    {
      label: 'Madarsa',
      value: 'Madarsa',
    },
    {
      label: 'Entertainment',
      value: 'Entertainment',
    },
    {
      label: 'Shopping',
      value: 'Shopping',
    },
    {
      label: 'Super Market',
      value: 'Super Market',
    },
    {
      label: 'Electrician',
      value: 'Electrician',
    },
    {
      label: 'Plumber',
      value: 'Plumber',
    },
    {
      label: 'Estate',
      value: 'Estate',
    },
    {
      label: 'Hospital',
      value: 'Hospital',
    },
    {
      label: 'Gym',
      value: 'Gym',
    },
  ]);

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const onUpdateFacilities = (value) => {
    setSelectedFacilities(value);
    console.log('########################', value);
  };

  const [facilities, setFacilities] = useState([]);
  // console.log('@@@@@@@@@@@@@@@@@@@@@@@@', facilities);

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    // console.log('##############', getFacilities._value);
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
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
        tags: [],
        facilities: selectedFacilities,
      }),
    );
    onNext();
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@', values);
    dispatch(setBusinessFormData({ ...values, tags: selectedTags }));
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
                    />
                    {errors.name ? (
                      <Text style={GlobalStyle.errorText}>{errors.name}</Text>
                    ) : null}
                  </View>

                  <View style={[GlobalStyle.inputContainer, { marginTop: 10 }]}>
                    <TextInput
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

                  <View
                    style={[
                      GlobalStyle.inputContainer,
                      Platform.OS === 'ios' && {
                        position: 'relative',
                        zIndex: 1,
                      },
                    ]}>
                    <DropDown
                      items={getCategories}
                      defaultValue={values.category}
                      placeholder={'Select a Category'}
                      searchablePlaceholder={'Search for a Category'}
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

                  <View
                    style={[
                      GlobalStyle.inputContainer,
                      { marginTop: 10, marginBottom: -15 },
                    ]}>
                    <MultiselectDropdown
                      label=""
                      data={facilities}
                      enableSearch
                      enableAvatar
                      floating
                      elevation={0}
                      borderRadius={7}
                      searchPlaceholder="Search for a facility"
                      emptyListText="No facility found"
                      itemTextStyle={{ color: colors.text }} //dropdown text unselected
                      selectedItemTextStyle={{ color: colors.primary}} //dropdown text selected
                      textInputStyle={{
                        backgroundColor: colors.card,
                      }}
                      underlineColor={colors.card}
                      parentDDContainerStyle={{
                        marginTop: 100,
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
                      chipStyle={{ marginBottom: 10, borderColor: colors.primary }}
                      emptySelectionText="Selected Facilities will appear here.."
                      emptySelectionTextStyle={{ color: colors.text }}
                      value={selectedFacilities}
                      onChange={onUpdateFacilities}
                    />
                  </View>

                  <View
                    style={[
                      GlobalStyle.inputContainer,
                      Platform.OS === 'ios' && {
                        position: 'relative',
                        zIndex: 1,
                      },
                    ]}>
                    <DropDownMultiSelect
                      items={tags}
                      multipleText={selectedTags.toString()}
                      defaultValue={selectedTags}
                      onChangeItem={(item) => setSelectedTags(item)}
                      placeholder={'Select Tags'}
                      searchablePlaceholder={'Search for Tags'}
                      max={15}
                    />
                  </View>

                  {/*<View style={GlobalStyle.inputContainer}>*/}
                  {/*  <TextInput*/}
                  {/*    style={{ marginTop: 10 }}*/}
                  {/*    onChangeText={handleChange('tags')}*/}
                  {/*    placeholder="Tags"*/}
                  {/*    value={values.tags}*/}
                  {/*  />*/}
                  {/*  {errors.tags ? (*/}
                  {/*    <Text style={GlobalStyle.errorText}>{errors.tags}</Text>*/}
                  {/*  ) : null}*/}
                  {/*</View>*/}

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
                buttonColor="rgba(93, 173, 226, 1)"
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
