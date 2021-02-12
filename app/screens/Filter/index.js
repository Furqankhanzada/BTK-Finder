import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag, TextInput } from '@components';
import * as Utils from '@utils';
import styles from './styles';
import { getCategories } from '../../actions/category';
import { getAllBusinesses, setFilteredData } from '../../actions/business';

export default function Filter(props) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const stateProps = useSelector(({ categories, businesses }) => {
    return {
      categories: categories.all,
      filteredData: businesses.filteredData,
    };
  });

  // const [priceBegin, setPriceBegin] = useState(0);
  // const [priceEnd, setPriceEnd] = useState(100);
  // const [rate, setRate] = useState(5);
  const [search, setSearch] = useState(stateProps?.filteredData?.search ?? '');
  const [selectedCategories, setSelectedCategories] = useState(
    stateProps?.filteredData?.category ?? [],
  );
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState(
    stateProps?.filteredData?.facilities ?? [],
  );
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  useEffect(() => {
    dispatch(getCategories({}));
  }, [dispatch]);

  useEffect(() => {
    if (route?.params?.category && route?.params?.categoryIcon) {
      setSelectedCategories([
        {
          name: route.params.category,
          icon: route.params.categoryIcon,
        },
      ]);
    }
  }, [dispatch]);

  const onAddCategory = () => {
    navigation.navigate('ChooseItems', {
      onApply: (data) => {
        setSelectedCategories(data);
      },
      items: stateProps.categories,
      selected: selectedCategories,
      title: 'Categories',
    });
  };

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

  const callBack = () => {
    if (route?.params?.home) {
      navigation.navigate('Place', {
        title: 'Search Results',
        latitude: route?.params?.coordinates?.latitude ?? null,
        longitude: route?.params?.coordinates?.longitude ?? null,
      });
    } else {
      navigation.navigate('Place');
    }
  };

  const onApply = () => {
    let payload = {
      limit: 10,
      skip: 0,
      search: search,
      category: selectedCategories.map((e) => e.name),
      facilities: selectedFacilities.map((e) => e.name),
      loading: true,
    };
    if (route?.params?.popular) {
      payload.popular = true;
    }
    if (route?.params?.coordinates) {
      payload.latitude = route.params.coordinates.longitude;
      payload.longitude = route.params.coordinates.latitude;
    }
    dispatch(
      setFilteredData({
        search: search,
        category: selectedCategories,
        facilities: selectedFacilities,
      }),
    );
    dispatch(getAllBusinesses(payload, callBack));
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
        onPressRight={() => onApply()}
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
            blurOnSubmit={true}
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
          <Text headline semibold style={{ marginTop: 30 }}>
            {t('category').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {selectedCategories.map((item) => {
              return (
                <Tag
                  outline={true}
                  icon={
                    <Icon
                      name={item.icon}
                      size={12}
                      color={colors.primary}
                      solid
                      style={{ marginRight: 5 }}
                    />
                  }
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
              onPress={() => onAddCategory()}
              style={[styles.addItem, { backgroundColor: colors.primary }]}>
              <Text style={{ fontSize: 10, marginRight: 5, color: 'white' }}>
                Add Category
              </Text>
              <Icon size={10} name="plus" color="white" />
            </TouchableOpacity>
          </View>
          <Text headline semibold style={{ marginTop: 30 }}>
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
