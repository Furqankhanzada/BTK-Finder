import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import {BaseColor, useTheme} from '@config';
import {Text, Icon, Image} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

export default function CategoryFull(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {style, image, icon, title, subtitle, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <ImageLoad
        source={image}
        style={{ flex: 1, borderRadius: 8 }}
        isShowActivity={false}
        placeholderStyle={{ height: 50, width: 50}}
        loadingStyle={{ size: 'large', color: '#68c9ef' }}
        borderRadius= {10}
      />
      <View style={styles.contentIcon}>
        <View
          style={[styles.iconCircle, {backgroundColor: colors.primaryLight}]}>
          <Icon name={icon} size={18} color={BaseColor.whiteColor} />
        </View>
        <View style={{paddingLeft: 10}}>
          <Text headline bold whiteColor>
            {title}
          </Text>
          <Text body2 bold whiteColor>
            {subtitle} {t('listings')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

CategoryFull.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

CategoryFull.defaultProps = {
  style: {},
  image: '',
  icon: '',
  title: '',
  subtitle: '',
  onPress: () => {},
};
