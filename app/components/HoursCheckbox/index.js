import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@config';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';
import { TextInput, Text } from '@components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './styles';
import moment from 'moment';

export default function HoursCheckbox(props) {
  const { colors } = useTheme();
  const { hours, setValue } = props;

  const [isSelected, setSelection] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromPickerVisible, setFromPickerVisibility] = useState(false);
  const [toPickerVisible, setToPickerVisibility] = useState(false);

  const toggleFromPicker = () => {
    setFromPickerVisibility(!fromPickerVisible);
  };
  const toggleToPicker = () => {
    setToPickerVisibility(!toPickerVisible);
  };

  const fromHandleConfirm = (value) => {
    setFrom(value);
    toggleFromPicker();
  };
  const toHandleConfirm = (value) => {
    setTo(value);
    toggleToPicker();
  };

  return (
    <View style={styles.checkBoxSection}>
      <View style={styles.checkBox}>
        <CheckBox
          style={{ flex: 1, padding: 10 }}
          onClick={() => {
            setSelection(!isSelected);
          }}
          isChecked={isSelected}
          rightText={hours.day}
          rightTextStyle={{ color: colors.text }}
          checkBoxColor="#5dade2"
        />
      </View>
      <View>
        {isSelected ? (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.sectionInnerContainer}
              onPress={() => toggleFromPicker()}>
              <Text style={styles.sectionInnerContainerText}>
                {from ? moment(from).format('hh:mm A') : 'From'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionInnerContainer}
              onPress={() => toggleToPicker()}>
              <Text style={styles.sectionInnerContainerText}>
                {to ? moment(to).format('hh:mm A') : 'To'}
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

HoursCheckbox.propTypes = {
  hours: PropTypes.object,
};

HoursCheckbox.defaultProps = {
  hours: {},
};
