import React from 'react';
import { useTheme } from '@config';
import StepIndicator from 'react-native-step-indicator';
import PropTypes from 'prop-types';

export default function CustomStepIndicator(props) {
  const { colors } = useTheme();

  const { position } = props;
  const labels = [
    'General',
    'Address',
    'Hours',
    'Price Range',
    'Gallery',
    'Review',
  ];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#5dade2',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#5dade2',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#5dade2',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#5dade2', // background coolor of finished steps
    stepIndicatorUnFinishedColor: colors.background, // background colors of unfinished steps
    stepIndicatorCurrentColor: colors.background, //background colors of active step
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#5dade2',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: colors.text,
    labelSize: 13,
    currentStepLabelColor: '#5dade2',
  };

  return (
    <StepIndicator
      customStyles={customStyles}
      currentPosition={position}
      labels={labels}
      stepCount={6}
    />
  );
}

CustomStepIndicator.propTypes = {
  position: PropTypes.string,
};

CustomStepIndicator.defaultProps = {
  position: '',
};
