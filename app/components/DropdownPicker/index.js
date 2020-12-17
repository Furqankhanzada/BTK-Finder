import React from 'react';
import { I18nManager, Platform, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import PropTypes from 'prop-types';
import { BaseColor, useTheme } from '@config';

export default function DropDown(props) {
  const {colors} = useTheme();
  const cardColor = colors.card;
  const { items, defaultValue, onChangeItem, placeholder, searchablePlaceholder } = props;
  return (
      <View
          style={{
              ...(Platform.OS !== 'android' && {
                  zIndex: 10
              })
          }}
      >
    <DropDownPicker
        items={items}
        zIndex={5000}
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
        defaultValue={defaultValue}
        itemStyle={{ justifyContent: 'flex-start' }}
        placeholder={placeholder}
        searchable={true}
        searchableStyle={{ borderColor: BaseColor.grayColor, color: colors.text }}
        searchablePlaceholder={searchablePlaceholder}
        searchablePlaceholderTextColor={BaseColor.grayColor}
        dropDownStyle={{
          backgroundColor: cardColor,
          color: colors.text,
          borderColor: BaseColor.grayColor
        }}
        dropDownMaxHeight={250}
        onChangeItem={onChangeItem}
        placeholderStyle={{color: BaseColor.grayColor}}
        activeLabelStyle={{color: colors.primary}}
        labelStyle={{color: colors.text}}
      />
      </View>
  );
}

DropDown.propTypes = {
  items: PropTypes.arrayOf,
  defaultValue: PropTypes.string,
  onChangeItem: PropTypes.func,
  placeholder: PropTypes.string,
  searchablePlaceholder: PropTypes.string,
};

DropDown.defaultProps = {
  items: {},
  defaultValue: '',
  onChangeItem: null,
  placeholder: '',
  searchablePlaceholder: '',
};
