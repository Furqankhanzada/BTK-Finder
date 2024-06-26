import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image, Text } from '@components';
import styles from './styles';
import PropTypes from 'prop-types';

export default function ProfileDetail(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    onPress,
    textFirst,
    textSecond,
    textThird,
    isAdmin,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.contentLeft, styleLeft]}>
        <View>
          <Image source={image} style={[styles.thumb, styleThumb]} />
          {/*<View*/}
          {/*  style={[styles.point, { backgroundColor: colors.primaryLight }]}>*/}
          {/*  <Text overline whiteColor semibold>*/}
          {/*    {point}*/}
          {/*  </Text>*/}
          {/*</View>*/}
        </View>
        <View style={{ alignItems: 'flex-start' }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text headline semibold numberOfLines={1}>
              {textFirst}
            </Text>
            {isAdmin ? <Text style={styles.badge}>ADMIN</Text> : null}
          </View>
          <Text
            body2
            style={{
              marginTop: 3,
              paddingRight: 10,
            }}
            numberOfLines={1}>
            {textSecond}
          </Text>
          <Text footnote grayColor numberOfLines={1}>
            {textThird}
          </Text>
        </View>
      </View>
      {/*{icon && (*/}
      {/*  <View style={[styles.contentRight, styleRight]}>*/}
      {/*    <Icon*/}
      {/*      name="angle-right"*/}
      {/*      size={18}*/}
      {/*      color={BaseColor.grayColor}*/}
      {/*      enableRTL={true}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*)}*/}
    </TouchableOpacity>
  );
}

ProfileDetail.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  textFirst: PropTypes.string,
  point: PropTypes.string,
  textSecond: PropTypes.string,
  textThird: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.bool,
  onPress: PropTypes.func,
  isAdmin: PropTypes.bool,
};

ProfileDetail.defaultProps = {
  image: '',
  textFirst: '',
  textSecond: '',
  icon: true,
  point: '',
  style: {},
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  onPress: () => {},
  isAdmin: false,
};
