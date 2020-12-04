import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import CheckBox from '@react-native-community/checkbox';
import { TextInput, Text } from '@components';
import styles from './styles';

export default function HoursCheckbox(props) {

    const { title } = props;
    const [isSelected, setSelection] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    return (
        <View style={styles.checkBoxSection}>
            <View style={styles.checkBox}>
              <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
              />
              <Text style={styles.checkBoxText}>
                {title}
              </Text>
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
                  />

                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setTo(text)}
                    placeholder="To"
                    keyboardType="numeric"
                    value={to}
                  />
                </View>
              ) : (
                <Text style={styles.closeText}>(Closed)</Text>
              )}
            </View>
        </View>
    )
}

HoursCheckbox.propTypes = {
  title: PropTypes.string,
};

HoursCheckbox.defaultProps = {
  title: '',
};