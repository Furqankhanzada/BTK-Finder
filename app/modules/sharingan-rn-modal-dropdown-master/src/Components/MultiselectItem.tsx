import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Lo from 'lodash';

import { colors, ITEMLAYOUT } from '../constants';
import type { IMultiselectDropdownItemProps } from '../types';
import PressableTouch from './PressableTouch';
import styles from "../styles";

const defaultProps = {
  selectedColor: colors.primary,
  itemTextStyle: {},
  itemContainerStyle: {},
  rippleColor: 'rgba(0,0,0,0.1)',
  enableAvatar: false,
};

const defaultAvatar = require('../assets/ddicon.png');

const MultiselectItem: React.FC<IMultiselectDropdownItemProps> = ({
  item,
  selected,
  onSelect,
  selectedColor,
  itemTextStyle,
  itemContainerStyle,
  rippleColor,
  disabled,
  enableAvatar,
  avatarSize,
  disableSelectionTick,
  selectedItemTextStyle,
  selectedItemViewStyle,
}) => {
  const { name, value, avatarSource } = item;
  const styles = StyleSheet.create({
    unselected: {
      paddingLeft: 5,
    },
    selected: {
      paddingLeft: 5,
    },
    listView: {
      flex: 1,
      paddingVertical: 10,
      height: ITEMLAYOUT,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconView: {
      width: 30,
    },
    textView: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    avatarView: {
      backgroundColor: 'transparent',
    },
  });

  const handleSelectValue = () => {
    onSelect(item);
  };

  const getSelectedStyles = () => {
    if (!Lo.isEmpty(selectedItemTextStyle)) {
      return { ...styles.selected, ...(selectedItemTextStyle as {}) };
    } else return styles.selected;
  };

  return (
    <PressableTouch
      onPress={handleSelectValue}
      disabled={disabled}
      key={Math.random().toString()}
      rippleColor={rippleColor}
    >
      <View
        style={[
          styles.listView,
          itemContainerStyle,
          selected.includes(item) ? selectedItemViewStyle : {},
        ]}
      >
        <View style={styles.textView}>
          {enableAvatar && (
            <Avatar.Icon
              size={avatarSize}
              style={styles.avatarView}
              icon={item.icon}
              color="#5dade2"
            />
          )}
          <Text
            style={[
              itemTextStyle,
              selected.includes(item)
                ? getSelectedStyles()
                : styles.unselected,
            ]}
          >
            {name}
          </Text>
        </View>
        <View style={styles.iconView}>
          {selected.includes(item) && !disableSelectionTick ? (
            <MaterialCommunityIcons
              name="check"
              size={18}
              color={selectedColor}
            />
          ) : null}
        </View>
      </View>
    </PressableTouch>
  );
};

MultiselectItem.defaultProps = defaultProps;

export default MultiselectItem;
