import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

import { useTheme } from '@config';
import { Text } from '@components';
import { OpenHours } from '@screens/businesses/models/BusinessPresentable';

type HoursCheckbox = {
  day: OpenHours;
  getObject: any;
};

export default function HoursCheckbox(props: HoursCheckbox) {
  const { colors } = useTheme();
  const { day, getObject } = props;

  const [isSelected, setSelection] = useState(day.isOpen ?? false);
  const [fromPickerVisible, setFromPickerVisibility] = useState(false);
  const [toPickerVisible, setToPickerVisibility] = useState(false);

  const toggleFromPicker = () => {
    setFromPickerVisibility(!fromPickerVisible);
  };
  const toggleToPicker = () => {
    setToPickerVisibility(!toPickerVisible);
  };

  const fromHandleConfirm = (value: Date) => {
    let from = moment(value).format('hh:mm a');
    getObject({ day: day.day, isOpen: day.isOpen ?? isSelected, from });
    toggleFromPicker();
  };
  const toHandleConfirm = (value: Date) => {
    let to = moment(value).format('hh:mm a');
    getObject({ day: day.day, isOpen: day.isOpen ?? isSelected, to });
    toggleToPicker();
  };

  const toggleCheck = () => {
    setSelection(!isSelected);
    getObject({ day: day.day, isOpen: !isSelected });
  };

  return (
    <View style={styles.checkBoxSection}>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          style={styles.checkboxRightMargin}
          onValueChange={() => toggleCheck()}
          value={day.isOpen ?? false}
          tintColors={{ true: colors.primary, false: colors.primary }}
          tintColor={colors.primary}
        />
        <Text body2>{day.day}</Text>
      </View>
      <View>
        {day.isOpen ? (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={[
                styles.sectionInnerContainer,
                { backgroundColor: colors.card },
              ]}
              onPress={() => toggleFromPicker()}>
              <Text
                style={[
                  styles.sectionInnerContainerText,
                  { color: colors.text },
                ]}>
                {day.from ? day.from : 'From'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sectionInnerContainer,
                { backgroundColor: colors.card },
              ]}
              onPress={() => toggleToPicker()}>
              <Text
                style={[
                  styles.sectionInnerContainerText,
                  { color: colors.text },
                ]}>
                {day.to ? day.to : 'To'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.closeText}>(Closed)</Text>
        )}
      </View>

      <DateTimePickerModal
        isVisible={fromPickerVisible}
        mode="time"
        onConfirm={fromHandleConfirm}
        onCancel={toggleFromPicker}
      />
      <DateTimePickerModal
        isVisible={toPickerVisible}
        mode="time"
        onConfirm={toHandleConfirm}
        onCancel={toggleToPicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkBoxSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  checkBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
    width: 130,
  },
  inputsSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: -10,
  },
  textInput: {
    marginTop: 17,
    maxWidth: 85,
    height: 30,
    marginRight: 10,
  },
  closeText: {
    color: 'red',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionInnerContainer: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  sectionInnerContainerText: {
    fontSize: 14,
  },
  checkboxRightMargin: {
    marginRight: 8,
  },
});
