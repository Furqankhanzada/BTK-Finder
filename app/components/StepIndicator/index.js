import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import PropTypes from 'prop-types';

export default function CustomStepIndicator(props) {

    const { position } = props;
    const labels = ['General', 'Address', 'Hours', 'Price Range', 'Review'];
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
        stepIndicatorFinishedColor: '#5dade2',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: '#5dade2',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: '#5dade2',
    };

    return (
        <StepIndicator
        customStyles={customStyles}
        currentPosition={position}
        labels={labels}
        stepCount={5}
      />
    )
}

CustomStepIndicator.propTypes = {
    position: PropTypes.string,
  };
  
CustomStepIndicator.defaultProps = {
    position: '',
};