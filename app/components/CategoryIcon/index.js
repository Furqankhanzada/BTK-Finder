import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {BaseColor, useTheme} from '@config';
import {Text, Icon} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

export default function CategoryIcon(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {style, icon, title, subtitle, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View
        style={[styles.iconContent, {backgroundColor: colors.primaryLight}]}>
        <Icon name={icon} size={32} color={BaseColor.whiteColor} solid />
      </View>
      <View style={{padding: 10}}>
        <Text headline semibold>
          {title}
        </Text>
        <Text footnote semibold grayColor style={{marginTop: 5}}>
          {subtitle} {t('location')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

CategoryIcon.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

CategoryIcon.defaultProps = {
  style: {},
  icon: '',
  title: '',
  subtitle: '',
  onPress: () => {},
};
