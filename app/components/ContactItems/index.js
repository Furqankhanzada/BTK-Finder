import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon} from '@components';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTheme} from '@config';

export default function Index(props) {
    const {colors} = useTheme();
    const {style, onPressWhatsApp, onPressPhone, data} = props;
    return (
        <View style={[styles.content, style]}>
            {data?.telephone ? (
                <View style={{flexDirection: 'row'}}>
                    {data?.telephone?.includes('02') ? null : (
                        <TouchableOpacity
                            onPress={onPressWhatsApp}
                            style={[
                                styles.icon,
                                {marginHorizontal: 16, backgroundColor: colors.primaryLight},
                            ]}>
                            <Icon name="whatsapp" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={onPressPhone}
                        style={[styles.icon, {backgroundColor: colors.primaryLight}]}>
                        <Icon name="mobile-alt" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
}

Index.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onPressWhatsApp: PropTypes.func,
    onPressPhone: PropTypes.func,
};

Index.defaultProps = {
    style: {},
    onPressWhatsApp: () => {},
    onPressPhone: () => {},
};
