import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, TextInput, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function ChooseLocation({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [country, setCountry] = useState('');
  const [location, setLocation] = useState([
    {id: 1, location: 'Alabama'},
    {id: 2, location: 'Columbia'},
    {id: 3, location: 'Arkansas'},
    {id: 4, location: 'Missouri'},
    {id: 5, location: 'Texas'},
    {id: 6, location: 'Utah'},
    {id: 7, location: 'Washington'},
    {id: 8, location: 'West Virginia'},
  ]);
  const [loading, setLoading] = useState(false);

  /**
   * @description make selected old data
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  useEffect(() => {
    const {selected} = route.params;

    if (selected.length > 0) {
      setLocation(
        location.map(item => {
          return {
            ...item,
            checked: selected.some(check => check.id == item.id),
          };
        }),
      );
    }
  }, []);

  /**
   * @description Called when apply
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  const onApply = () => {
    const {onApply} = route.params;
    setLoading(true);
    setTimeout(() => {
      onApply(location.filter(item => item.checked));
      navigation.goBack();
    }, 500);
  };

  /**
   * @description Called when setting location is selected
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  const onChange = select => {
    setLocation(
      location.map(item => {
        if (item.location == select.location) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      }),
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('location')}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.contain}>
        <TextInput
          onChangeText={text => setCountry(text)}
          placeholder={t('search')}
          value={country}
          icon={
            <TouchableOpacity onPress={() => setCountry('')}>
              <Icon name="times" size={16} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />
        <FlatList
          contentContainerStyle={{paddingVertical: 15}}
          data={location}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.item, {borderBottomColor: colors.border}]}
              onPress={() => onChange(item)}>
              <Text
                body1
                style={
                  item.checked
                    ? {
                        color: colors.primary,
                      }
                    : {}
                }>
                {item.location}
              </Text>
              {item.checked && (
                <Icon name="check" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
        />
        <Button full loading={loading} onPress={() => onApply()}>
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
