import React from 'react';
import AppModal from 'react-native-modal';

const Modal = ({
  isVisible,
  onSwipeComplete,
  swipeDirection,
  style,
  children,
}) => {
  return (
    <AppModal
      isVisible={isVisible}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={swipeDirection}
      style={style}>
      {children}
    </AppModal>
  );
};

export default Modal;
