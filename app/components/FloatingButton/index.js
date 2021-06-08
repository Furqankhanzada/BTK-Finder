import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import { Icon } from '@components';
import { useTheme } from '@config';

export default function FloatingButton(props) {
  const { colors } = useTheme();
  const { onPress, offsetX, offsetY, loading, iconName } = props;
  return (
    <ActionButton
      buttonColor={colors.primary}
      nativeFeedbackRippleColor="transparent"
      onPress={onPress}
      offsetX={offsetX}
      offsetY={offsetY}
      icon={
        loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Icon name={iconName} size={20} color="white" enableRTL={true} />
        )
      }
    />
  );
}

FloatingButton.propTypes = {
  onPress: PropTypes.function,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  loading: PropTypes.bool,
  iconName: PropTypes.string,
};

FloatingButton.defaultProps = {
  onPress: () => {},
  offsetX: 20,
  offsetY: 10,
  loading: false,
  iconName: 'arrow-right',
};
