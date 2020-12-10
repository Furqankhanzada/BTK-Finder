import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@config';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';
import { Text } from '@components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './styles';
import moment from 'moment';

export default function HoursCheckbox(props) {
    const { colors } = useTheme();
    const { day, getObject } = props;

    const [isSelected, setSelection] = useState(false);
    const [fromPickerVisible, setFromPickerVisibility] = useState(false);
    const [toPickerVisible, setToPickerVisibility] = useState(false);

    const toggleFromPicker = () => {
        setFromPickerVisibility(!fromPickerVisible);
    };
    const toggleToPicker = () => {
        setToPickerVisibility(!toPickerVisible);
    };

    const fromHandleConfirm = (value) => {
        let from = moment(value).format('hh:mm A');
        getObject({day: day.day, isOpen: isSelected, from});
        toggleFromPicker();
    };
    const toHandleConfirm = (value) => {
        let to = moment(value).format('hh:mm A');
        getObject({day: day.day, isOpen: isSelected, to});
        toggleToPicker();
    };

    const toggleCheck = () => {
        setSelection(!isSelected);
        getObject({day: day.day, isOpen: !isSelected});
    };

    return (
        <View style={styles.checkBoxSection}>
            <View style={styles.checkBox}>
                <CheckBox
                    style={{ flex: 1, padding: 10 }}
                    onClick={() => toggleCheck()}
                    isChecked={day.isOpen}
                    rightText={day.day}
                    rightTextStyle={{ color: colors.text }}
                    checkBoxColor="#5dade2"
                />
            </View>
            <View>
                {day.isOpen ? (
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            style={[styles.sectionInnerContainer, {backgroundColor: colors.card}]}
                            onPress={() => toggleFromPicker()}>
                            <Text style={[styles.sectionInnerContainerText, {color: colors.text}]}>
                                {day.from ? day.from : 'From'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sectionInnerContainer, {backgroundColor: colors.card}]}
                            onPress={() => toggleToPicker()}>
                            <Text style={[styles.sectionInnerContainerText, {color: colors.text}]}>
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

HoursCheckbox.propTypes = {
    hours: PropTypes.object,
};

HoursCheckbox.defaultProps = {
    hours: {},
};
