import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image, Text } from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import { useTheme, Images } from '@config';

export default function MenuItem(props) {
  const { colors } = useTheme();
  const { style, imageStyle, name, description, price, image, onPress } = props;
  return (
    <TouchableOpacity
      style={[
        styles.contain,
        {
          backgroundColor: colors.background,
          borderColor: colors.card,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image
        source={image ? image : Images.imagePlaceholder}
        style={[styles.thumb, imageStyle, { backgroundColor: 'white' }]}
      />
      <View style={styles.content}>
        <Text caption2 numberOfLines={2} style={{ textAlign: 'center' }}>
          {name}
        </Text>
        {/*{description ? (*/}
        {/*  <Text*/}
        {/*    numberOfLines={2}*/}
        {/*    overline*/}
        {/*    grayColor*/}
        {/*    style={{*/}
        {/*      paddingBottom: 5,*/}
        {/*      textAlign: 'center',*/}
        {/*    }}>*/}
        {/*    {description}*/}
        {/*  </Text>*/}
        {/*) : null}*/}
        <Text overline semibold>
          {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

MenuItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageStyle: PropTypes.object,
  name: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.string,
  image: PropTypes.node.isRequired,
  onPress: PropTypes.func,
};

MenuItem.defaultProps = {
  style: {},
  imageStyle: {},
  name: '',
  description: '',
  price: '',
  image: '',
  onPress: () => {},
};
