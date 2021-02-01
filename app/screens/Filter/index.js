import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  BookingTime,
  StarRating,
  TextInput,
} from '@components';
import RangeSlider from 'rn-range-slider';
import * as Utils from '@utils';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';

export default function Filter({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const stateProps = useSelector(({ businesses }) => {
    return {
      filteredCategory: businesses.filteredCategory,
    };
  });

  const [priceBegin, setPriceBegin] = useState(0);
  const [priceEnd, setPriceEnd] = useState(100);
  const [rate, setRate] = useState(5);
  const [search, setSearch] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [location, setLocation] = useState([]);
  const [area, setArea] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  /**
   * @description export text location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  // const renderTextFromList = (list) => {
  //   let listString = [];
  //   listString = list.map((item) => {
  //     return item.location;
  //   });
  //   return listString.join(',');
  // };

  /**
   * @description Called when filtering option > location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  // const onNavigateLocation = () => {
  //   navigation.navigate('ChooseItems', {
  //     onApply: (data) => {
  //       setLocation(data);
  //     },
  //     selected: location,
  //   });
  // };

  /**
   * @description Called when filtering option > area
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  // const onNavigateArea = () => {
  //   navigation.navigate('ChooseItems', {
  //     onApply: (data) => {
  //       setArea(data);
  //     },
  //     selected: area,
  //   });
  // };

  const onAddFacility = () => {
    navigation.navigate('ChooseItems', {
      onApply: (data) => {
        setSelectedFacilities(data);
      },
      items: facilities,
      selected: selectedFacilities,
      title: 'Facilities',
    });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => navigation.goBack()}
      />
      <ScrollView
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <TextInput
            onChangeText={(text) => setSearch(text)}
            placeholder={t('search')}
            value={search}
            onSubmitEditing={() => {}}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                }}
                style={styles.btnClearSearch}>
                <Icon name="times" size={18} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
          />
          <Text headline semibold style={{ marginTop: 20 }}>
            {t('category').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {stateProps?.filteredCategory?.map((item, index) => {
              return (
                <Tag
                  outline={true}
                  key={item + index}
                  style={{
                    marginTop: 8,
                    marginRight: 8,
                  }}>
                  {item}
                </Tag>
              );
            })}
            <TouchableOpacity
              onPress={() => navigation.navigate('Category', { filter: true })}
              style={[styles.addItem, { backgroundColor: colors.primary }]}>
              <Text style={{ fontSize: 10, marginRight: 5, color: 'white' }}>
                Add Category
              </Text>
              <Icon size={10} name="plus" color="white" />
            </TouchableOpacity>
          </View>
          <Text headline semibold style={{ marginTop: 20 }}>
            {t('facilities').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {selectedFacilities.map((item) => {
              return (
                <Tag
                  icon={
                    <Icon
                      name={item.icon}
                      size={12}
                      color={colors.accent}
                      solid
                      style={{ marginRight: 5 }}
                    />
                  }
                  chip
                  key={item.name}
                  style={{
                    marginTop: 8,
                    marginRight: 8,
                  }}>
                  {item.name}
                </Tag>
              );
            })}
            <TouchableOpacity
              onPress={() => onAddFacility()}
              style={[styles.addItem, { backgroundColor: colors.accent }]}>
              <Text style={{ fontSize: 10, marginRight: 5, color: 'white' }}>
                Add Facility
              </Text>
              <Icon size={10} name="plus" color="white" />
            </TouchableOpacity>
          </View>
          {/*<TouchableOpacity*/}
          {/*  style={styles.locationContent}*/}
          {/*  onPress={() => onNavigateLocation()}>*/}
          {/*  <View>*/}
          {/*    <Text headline semibold>*/}
          {/*      {t('location').toUpperCase()}*/}
          {/*    </Text>*/}
          {/*    {location.length > 0 ? (*/}
          {/*      <Text footnote primaryColor style={{ marginTop: 5 }}>*/}
          {/*        {renderTextFromList(location)}*/}
          {/*      </Text>*/}
          {/*    ) : (*/}
          {/*      <Text footnote grayColor style={{ marginTop: 5 }}>*/}
          {/*        {t('please_select')}*/}
          {/*      </Text>*/}
          {/*    )}*/}
          {/*  </View>*/}
          {/*  <Icon name="angle-right" size={18} color={BaseColor.grayColor} />*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity*/}
          {/*  style={styles.locationContent}*/}
          {/*  onPress={() => onNavigateArea()}>*/}
          {/*  <View>*/}
          {/*    <Text headline semibold>*/}
          {/*      {t('area').toUpperCase()}*/}
          {/*    </Text>*/}
          {/*    {area.length > 0 ? (*/}
          {/*      <Text footnote primaryColor style={{ marginTop: 5 }}>*/}
          {/*        {renderTextFromList(area)}*/}
          {/*      </Text>*/}
          {/*    ) : (*/}
          {/*      <Text footnote grayColor style={{ marginTop: 5 }}>*/}
          {/*        {t('please_select')}*/}
          {/*      </Text>*/}
          {/*    )}*/}
          {/*  </View>*/}
          {/*  <Icon name="angle-right" size={18} color={BaseColor.grayColor} />*/}
          {/*</TouchableOpacity>*/}
          {/*<Text headline semibold style={{ marginTop: 20 }}>*/}
          {/*  {t('price').toUpperCase()}*/}
          {/*</Text>*/}
          {/*<View style={styles.contentRange}>*/}
          {/*  <Text caption1 grayColor>*/}
          {/*    $0*/}
          {/*  </Text>*/}
          {/*  <Text caption1 grayColor>*/}
          {/*    $100*/}
          {/*  </Text>*/}
          {/*</View>*/}
          {/*<RangeSlider*/}
          {/*  style={{*/}
          {/*    width: '100%',*/}
          {/*    height: 40,*/}
          {/*  }}*/}
          {/*  thumbRadius={12}*/}
          {/*  lineWidth={5}*/}
          {/*  gravity={'center'}*/}
          {/*  labelStyle="none"*/}
          {/*  min={0}*/}
          {/*  max={100}*/}
          {/*  step={1}*/}
          {/*  selectionColor={colors.primary}*/}
          {/*  blankColor={colors.border}*/}
          {/*  onValueChanged={(low, high, fromUser) => {*/}
          {/*    setPriceBegin(low);*/}
          {/*    setPriceEnd(high);*/}
          {/*  }}*/}
          {/*  onTouchStart={() => {*/}
          {/*    setScrollEnabled(false);*/}
          {/*  }}*/}
          {/*  onTouchEnd={() => {*/}
          {/*    setScrollEnabled(true);*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<View style={styles.contentResultRange}>*/}
          {/*  <Text caption1>{t('avg_price')}</Text>*/}
          {/*  <Text caption1>*/}
          {/*    ${priceBegin} - ${priceEnd}*/}
          {/*  </Text>*/}
          {/*</View>*/}
        </View>
        {/*<Text*/}
        {/*  headline*/}
        {/*  semibold*/}
        {/*  style={{*/}
        {/*    paddingHorizontal: 20,*/}
        {/*    marginTop: 5,*/}
        {/*  }}>*/}
        {/*  {t('business_color').toUpperCase()}*/}
        {/*</Text>*/}
        {/*<FlatList*/}
        {/*  contentContainerStyle={{ paddingTop: 10 }}*/}
        {/*  horizontal={true}*/}
        {/*  showsHorizontalScrollIndicator={false}*/}
        {/*  data={interio}*/}
        {/*  keyExtractor={(item, index) => item.id}*/}
        {/*  renderItem={({ item, index }) => (*/}
        {/*    <TouchableOpacity*/}
        {/*      style={[styles.circleIcon, { backgroundColor: item.color }]}*/}
        {/*      onPress={() => onSelectInterio(item)}>*/}
        {/*      {item.checked && (*/}
        {/*        <Icon name="check" size={16} color={BaseColor.whiteColor} />*/}
        {/*      )}*/}
        {/*    </TouchableOpacity>*/}
        {/*  )}*/}
        {/*/>*/}
        {/*<View style={{ paddingHorizontal: 20, marginTop: 20 }}>*/}
        {/*  <Text headline semibold style={{ marginBottom: 10 }}>*/}
        {/*    {t('open_time').toUpperCase()}*/}
        {/*  </Text>*/}
        {/*  <BookingTime />*/}
        {/*</View>*/}
        {/*<View style={{ paddingHorizontal: 20, marginVertical: 20 }}>*/}
        {/*  <Text headline semibold>*/}
        {/*    {t('rating').toUpperCase()}*/}
        {/*  </Text>*/}
        {/*  <View style={{ width: 160, marginTop: 10 }}>*/}
        {/*    <StarRating*/}
        {/*      starSize={26}*/}
        {/*      maxStars={5}*/}
        {/*      rating={rate}*/}
        {/*      selectedStar={(rate) => setRate(rate)}*/}
        {/*      fullStarColor={BaseColor.yellowColor}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*</View>*/}
      </ScrollView>
    </SafeAreaView>
  );
}
