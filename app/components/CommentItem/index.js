import React from 'react';
import { View } from 'react-native';
import { Images, BaseColor, useTheme } from '@config';
import { Text, Image, StarRating } from '@components';
import PropTypes from 'prop-types';
import styles from './styles';

export default function CommentItem(props) {
  const { colors } = useTheme();
  const cardColor = colors.card;
  const { style, image, name, rate, date, title, comment } = props;
  return (
    <View style={[styles.contain, { backgroundColor: cardColor }, style]}>
      <View style={[styles.contentHeader, { borderColor: colors.border }]}>
        <View style={styles.contentLeft}>
          <Image source={image} style={styles.thumb} />
          <View>
            <Text overline numberOfLines={1}>
              {name}
            </Text>
            <Text overline grayColor numberOfLines={1}>
              {date}
            </Text>
          </View>
        </View>
        <View style={styles.contentRight}>
          <View style={styles.contentRate}>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={rate}
              selectedStar={rating => {}}
              fullStarColor={BaseColor.yellowColor}
            />
          </View>
        </View>
      </View>
      <View>
        <Text body2 semibold style={{ paddingBottom: 5 }}>
          {title}
        </Text>
        <Text footnote grayColor>
          {comment}
        </Text>
      </View>
    </View>
  );
}

CommentItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  rate: PropTypes.number,
  date: PropTypes.string,
  title: PropTypes.string,
  comment: PropTypes.string,
};

CommentItem.defaultProps = {
  style: {},
  image: Images.defaultAvatar,
  name: '',
  rate: 0,
  date: '',
  title: '',
  comment: '',
};
