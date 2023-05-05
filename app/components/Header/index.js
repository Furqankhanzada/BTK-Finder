import React, { useEffect } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { Text } from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import useAppStore from '../../store/appStore';

export default function Header(props) {
  const { themeMode } = useAppStore();
  const {
    style,
    styleLeft,
    styleCenter,
    styleRight,
    styleRightSecond,
    title,
    subTitle,
    onPressLeft,
    onPressRight,
    onPressRightSecond,
    renderLeft,
    renderRightSecond,
    renderRight,
    barStyle,
  } = props;
  const isDarkMode = useDarkMode();

  useEffect(() => {
    let option = isDarkMode ? 'light-content' : 'dark-content';
    if (themeMode === 'light') {
      option = 'light-content';
    }
    if (themeMode === 'dark') {
      option = 'dark-content';
    }
    if (barStyle) {
      option = barStyle;
    }
    StatusBar.setBarStyle(option, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeMode, isDarkMode]);

  return (
    <View style={[styles.contain, style]}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.contentLeft, styleLeft]}
          onPress={onPressLeft}>
          {renderLeft()}
        </TouchableOpacity>
      </View>
      <View style={[styles.contentCenter, styleCenter]}>
        <Text headline numberOfLines={1}>
          {title}
        </Text>
        {subTitle != '' && (
          <Text caption2 light>
            {subTitle}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          style={[styles.contentRightSecond, styleRightSecond]}
          onPress={onPressRightSecond}>
          {renderRightSecond()}
        </TouchableOpacity>
        {renderRight ? (
          <TouchableOpacity
            style={[styles.contentRight, styleRight]}
            onPress={onPressRight}>
            {renderRight()}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

Header.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRightSecond: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderLeft: PropTypes.func,
  renderRight: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  renderRightSecond: PropTypes.func,
  onPressRightSecond: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  barStyle: PropTypes.string,
};

Header.defaultProps = {
  style: {},
  styleLeft: {},
  styleCenter: {},
  styleRight: {},
  styleRightSecond: {},
  renderLeft: () => {},
  renderRight: () => {},
  renderRightSecond: () => {},
  onPressLeft: () => {},
  onPressRight: () => {},
  onPressRightSecond: () => {},
  title: 'Title',
  subTitle: '',
  barStyle: '',
};
