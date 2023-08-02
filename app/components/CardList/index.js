import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseColor, useTheme } from '@config';
import { Image, Text, StarRating, Tag, Icon } from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import { Images } from '@config';
import NumberFormat from 'react-number-format';

export default function CardList(props) {
  const { colors } = useTheme();
  const {
    style,
    image,
    title,
    selectedTitle,
    imageStyle,
    subtitle,
    options,
    selectedOption,
    rate,
    onPress,
    onPressTag,
    deleteAble,
    editAble,
    onPressDelete,
    onPressEdit,
    iconRight,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, { overflow: 'hidden' }, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={image} style={[styles.image, imageStyle]} />
      <View
        style={{
          paddingHorizontal: 10,
          justifyContent: 'center',
          flexShrink: 1,
        }}>
        <Text headline semibold numberOfLines={2}>
          {title}
        </Text>
        <Text
          footnote
          semibold
          grayColor
          style={{ marginTop: 4 }}
          numberOfLines={3}>
          {subtitle}
        </Text>
        {options && options.length ? null : (
          <View style={styles.contentRate}>
            <Tag onPress={onPressTag} rateSmall style={{ marginRight: 4 }}>
              <NumberFormat
                value={rate ? rate : 0.0}
                displayType={'text'}
                decimalScale={1}
                fixedDecimalScale={true}
                renderText={(value) => (
                  <Text style={{ fontSize: 10, color: 'white' }}>{value}</Text>
                )}
              />
            </Tag>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={rate}
              selectedStar={onPressTag}
              fullStarColor={BaseColor.yellowColor}
            />
          </View>
        )}
        {options && options.length ? (
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {options.map((option, index) => (
              <Tag
                key={index}
                onPress={() => onPressTag(option)}
                gray
                style={
                  ({ marginRight: 4 },
                  selectedOption === option && selectedTitle === title
                    ? { backgroundColor: colors.primary }
                    : {})
                }>
                {option}
              </Tag>
            ))}
          </View>
        ) : null}
      </View>
      {deleteAble ? (
        <TouchableOpacity
          onPress={onPressDelete}
          style={[styles.deleteIcon, { backgroundColor: BaseColor.redColor }]}>
          <Icon name="trash" color="white" />
        </TouchableOpacity>
      ) : null}
      {editAble ? (
        <TouchableOpacity
          onPress={onPressEdit}
          style={[styles.editIcon, { backgroundColor: colors.primary }]}>
          <Icon name="pencil-alt" color="white" />
        </TouchableOpacity>
      ) : null}
      {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
    </TouchableOpacity>
  );
}

CardList.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  selectedTitle: PropTypes.string,
  subtitle: PropTypes.string,
  options: PropTypes.array,
  selectedOption: PropTypes.string,
  rate: PropTypes.number,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
  deleteAble: PropTypes.bool,
  editAble: PropTypes.bool,
  onPressDelete: PropTypes.func,
  onPressEdit: PropTypes.func,
  iconRight: PropTypes.element,
};

CardList.defaultProps = {
  style: {},
  image: Images.imagePlaceholder,
  imageStyle: {},
  title: '',
  selectedTitle: '',
  subtitle: '',
  options: [],
  selectedOption: '',
  rate: 0,
  onPress: () => {},
  onPressTag: () => {},
  deleteAble: false,
  editAble: false,
  onPressDelete: () => {},
  onPressEdit: () => {},
  iconRight: null,
};
