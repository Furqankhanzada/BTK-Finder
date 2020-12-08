import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@config';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';
import { TextInput, Text } from '@components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './styles';

export default function HoursCheckbox(props) {

  const { colors } = useTheme();
  const { hours } = props;

  const [isSelected, setSelection] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleConfirm = () => {
    hideTimePicker();
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
          rightTextStyle={{color: colors.text}}
          checkBoxColor="#5dade2"
        />
      </View>
      <View>
        {isSelected ? (
          <View style={styles.inputsSection}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setFrom(text)}
              placeholder="From"
              keyboardType="numeric"
              value={from}
              onFocus={showTimePicker}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTo(text)}
              placeholder="To"
              keyboardType="numeric"
              value={to}
              onFocus={showTimePicker}
            />

            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideTimePicker}
              display={"spinner"}
            />
          </View>
        ) : (
          <Text style={styles.closeText}>(Closed)</Text>
        )}
      </View>
    </View>
  );
}

HoursCheckbox.propTypes = {
  hours: PropTypes.object,
};

HoursCheckbox.defaultProps = {
  hours: {},
};
