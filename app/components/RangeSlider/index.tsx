import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Slider from 'rn-range-slider';
import PropTypes from 'prop-types';

import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';
import styles from './styles';

interface Props {
  color: string;
  text?: string;
  selectionColor: string;
  style: StyleProp<ViewStyle>;
  max: number;
  low?: number;
  high?: number;
  onValueChanged?: (low: number, hight: number) => void;
}

export default function RangeSlider(props: Props) {
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(
    () => <Rail color={props.color} />,
    [props.color],
  );
  const renderRailSelected = useCallback(
    () => <RailSelected color={props.selectionColor} />,
    [props.selectionColor],
  );
  const renderLabel = useCallback(
    (value) => <Label text={value} color={props.selectionColor} />,
    [props.selectionColor],
  );
  const renderNotch = useCallback(
    () => <Notch color={props.selectionColor} />,
    [props.selectionColor],
  );

  return (
    <Slider
      style={[styles.slider, props.style]}
      min={0}
      max={props.max ?? 5000}
      step={1}
      disableRange={false}
      floatingLabel={true}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      renderNotch={renderNotch}
      onValueChanged={props.onValueChanged}
      low={props.low ?? 0}
      high={props.high ?? props.max}
    />
  );
}

RangeSlider.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  color: PropTypes.string,
  selectionColor: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onValueChanged: PropTypes.func,
};

RangeSlider.defaultProps = {
  style: {},
  color: '#7f7f7f',
  selectionColor: '#4499ff',
  min: 0,
  max: 5000,
  onValueChanged: () => {},
};
