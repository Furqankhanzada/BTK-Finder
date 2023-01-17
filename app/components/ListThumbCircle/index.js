import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Image, Text } from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import { BaseColor, useTheme } from '@config';
export default function ListThumbCircle(props) {
  const { colors } = useTheme();
  const {
    style,
    imageStyle,
    image,
    txtLeftTitle,
    txtContent,
    txtContentStyle,
    txtSubContent,
    txtRight,
    iconRightName,
    onPress,
    icon,
  } = props;
  return (
    <TouchableOpacity
      style={[
        styles.contain,
        { borderBottomWidth: 1, borderBottomColor: colors.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      {!icon ? (
        <Image source={image} style={[styles.thumb, imageStyle]} />
      ) : (
        <View
          style={[
            styles.thumb,
            styles.icon,
            { backgroundColor: colors.primary },
          ]}>
          <Icon name={icon} size={20} color={BaseColor.whiteColor} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.left}>
          <Text headline semibold>
            {txtLeftTitle}
          </Text>
          <Text
            note
            numberOfLines={2}
            footnote
            grayColor
            style={[{ paddingTop: 5 }, txtContentStyle]}>
            {txtContent}
          </Text>
          {txtSubContent ? (
            <Text caption2 grayColor numberOfLines={1} style={{ marginTop: 5 }}>
              {txtSubContent}
            </Text>
          ) : null}
        </View>
        {txtRight || iconRightName ? (
          <View style={styles.right}>
            {txtRight ? (
              <Text caption2 grayColor numberOfLines={1}>
                {txtRight}
              </Text>
            ) : null}
            {iconRightName ? (
              <Icon
                name={iconRightName}
                size={15}
                color={colors.primary}
                solid
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

ListThumbCircle.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageStyle: PropTypes.object,
  image: PropTypes.node.isRequired,
  txtLeftTitle: PropTypes.string,
  txtContent: PropTypes.string,
  txtSubContent: PropTypes.string,
  txtContentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  txtRight: PropTypes.string,
  iconRightName: PropTypes.string,
  onPress: PropTypes.func,
  icon: PropTypes.string,
};

ListThumbCircle.defaultProps = {
  style: {},
  imageStyle: {},
  image: '',
  txtLeftTitle: '',
  txtContent: '',
  txtSubContent: null,
  txtContentStyle: {},
  txtRight: '',
  iconRightName: null,
  onPress: () => {},
};
