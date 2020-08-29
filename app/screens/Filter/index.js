import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
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
import {useTranslation} from 'react-i18next';

export default function Filter({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [priceBegin, setPriceBegin] = useState(0);
  const [priceEnd, setPriceEnd] = useState(100);
  const [rate, setRate] = useState(5);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState([
    {id: '1', name: 'Architecture', checked: true},
    {id: '2', name: 'Insurance'},
    {id: '3', name: 'Beauty'},
    {id: '4', name: 'Artists'},
    {id: '5', name: 'Outdoors'},
    {id: '6', name: 'Clothing'},
    {id: '7', name: 'Jewelry'},
  ]);
  const [facilities, setFacilities] = useState([
    {id: '1', icon: 'wifi', name: 'Free Wifi', checked: true},
    {id: '2', icon: 'bath', name: 'Shower'},
    {id: '3', icon: 'paw', name: 'Pet Allowed'},
    {id: '4', icon: 'bus', name: 'Shuttle Bus'},
    {id: '5', icon: 'cart-plus', name: 'Supper Market'},
    {id: '6', icon: 'clock', name: 'Open 24/7'},
  ]);
  const [interio, setInterio] = useState([
    {id: '1', name: '1', color: '#FD5739', checked: true},
    {id: '2', name: '2', color: '#C31C0D'},
    {id: '3', name: '3', color: '#FF8A65'},
    {id: '4', name: '4', color: '#4A90A4'},
    {id: '5', name: '5', color: '#212121'},
  ]);
  const [location, setLocation] = useState([]);
  const [area, setArea] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  /**
   * @description export text location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  const renderTextFromList = list => {
    let listString = [];
    listString = list.map(item => {
      return item.location;
    });
    return listString.join(',');
  };

  /**
   * @description Called when filtering option > location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  const onNavigateLocation = () => {
    navigation.navigate('ChooseLocation', {
      onApply: data => {
        setLocation(data);
      },
      selected: location,
    });
  };

  /**
   * @description Called when filtering option > area
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  const onNavigateArea = () => {
    navigation.navigate('ChooseLocation', {
      onApply: data => {
        setArea(data);
      },
      selected: area,
    });
  };
  /**
   * @description Called when filtering option > category
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  const onSelectCategory = select => {
    setCategory(
      category.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    );
  };

  /**
   * @description Called when filtering option > Facilities
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  const onSelectFacilities = select => {
    setFacilities(
      facilities.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    );
  };

  /**
   * @description Called when filtering option > Interio
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  const onSelectInterio = select => {
    setInterio(
      interio.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
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
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <TextInput
            onChangeText={text => setSearch(text)}
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
          <Text headline semibold style={{marginTop: 20}}>
            {t('category').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {category.map(item => {
              return (
                <Tag
                  primary={item.checked}
                  outline={!item.checked}
                  key={item.id}
                  style={{
                    marginTop: 8,
                    marginRight: 8,
                  }}
                  onPress={() => onSelectCategory(item)}>
                  {item.name}
                </Tag>
              );
            })}
          </View>
          <Text headline semibold style={{marginTop: 20}}>
            {t('facilities').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {facilities.map(item => {
              return (
                <Tag
                  icon={
                    <Icon
                      name={item.icon}
                      size={12}
                      color={colors.accent}
                      solid
                      style={{marginRight: 5}}
                    />
                  }
                  chip
                  key={item.id}
                  style={{
                    marginTop: 8,
                    marginRight: 8,
                  }}>
                  {item.name}
                </Tag>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.locationContent}
            onPress={() => onNavigateLocation()}>
            <View>
              <Text headline semibold>
                {t('location').toUpperCase()}
              </Text>
              {location.length > 0 ? (
                <Text footnote primaryColor style={{marginTop: 5}}>
                  {renderTextFromList(location)}
                </Text>
              ) : (
                <Text footnote grayColor style={{marginTop: 5}}>
                  {t('please_select')}
                </Text>
              )}
            </View>
            <Icon name="angle-right" size={18} color={BaseColor.grayColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationContent}
            onPress={() => onNavigateArea()}>
            <View>
              <Text headline semibold>
                {t('area').toUpperCase()}
              </Text>
              {area.length > 0 ? (
                <Text footnote primaryColor style={{marginTop: 5}}>
                  {renderTextFromList(area)}
                </Text>
              ) : (
                <Text footnote grayColor style={{marginTop: 5}}>
                  {t('please_select')}
                </Text>
              )}
            </View>
            <Icon name="angle-right" size={18} color={BaseColor.grayColor} />
          </TouchableOpacity>
          <Text headline semibold style={{marginTop: 20}}>
            {t('price').toUpperCase()}
          </Text>
          <View style={styles.contentRange}>
            <Text caption1 grayColor>
              $0
            </Text>
            <Text caption1 grayColor>
              $100
            </Text>
          </View>
          <RangeSlider
            style={{
              width: '100%',
              height: 40,
            }}
            thumbRadius={12}
            lineWidth={5}
            gravity={'center'}
            labelStyle="none"
            min={0}
            max={100}
            step={1}
            selectionColor={colors.primary}
            blankColor={colors.border}
            onValueChanged={(low, high, fromUser) => {
              setPriceBegin(low);
              setPriceEnd(high);
            }}
            onTouchStart={() => {
              setScrollEnabled(false);
            }}
            onTouchEnd={() => {
              setScrollEnabled(true);
            }}
          />
          <View style={styles.contentResultRange}>
            <Text caption1>{t('avg_price')}</Text>
            <Text caption1>
              ${priceBegin} - ${priceEnd}
            </Text>
          </View>
        </View>
        <Text
          headline
          semibold
          style={{
            paddingHorizontal: 20,
            marginTop: 5,
          }}>
          {t('business_color').toUpperCase()}
        </Text>
        <FlatList
          contentContainerStyle={{paddingTop: 10}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={interio}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[styles.circleIcon, {backgroundColor: item.color}]}
              onPress={() => onSelectInterio(item)}>
              {item.checked && (
                <Icon name="check" size={16} color={BaseColor.whiteColor} />
              )}
            </TouchableOpacity>
          )}
        />
        <View style={{paddingHorizontal: 20, marginTop: 20}}>
          <Text headline semibold style={{marginBottom: 10}}>
            {t('open_time').toUpperCase()}
          </Text>
          <BookingTime />
        </View>
        <View style={{paddingHorizontal: 20, marginVertical: 20}}>
          <Text headline semibold>
            {t('rating').toUpperCase()}
          </Text>
          <View style={{width: 160, marginTop: 10}}>
            <StarRating
              starSize={26}
              maxStars={5}
              rating={rate}
              selectedStar={rate => setRate(rate)}
              fullStarColor={BaseColor.yellowColor}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
