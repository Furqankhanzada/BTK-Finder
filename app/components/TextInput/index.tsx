import React from 'react';
import {
  TextInput,
  View,
  I18nManager,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BaseStyle, BaseColor, useTheme, useFont } from '@config';

interface Props extends TextInputProps {
  success?: boolean;
  icon?: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
}

export default React.forwardRef<TextInput, Props>((props, ref) => {
  const { colors } = useTheme();
  const font = useFont();

  const cardColor = colors.card;
  const {
    style, //TODO: remove it so it cannot be used in View as its input style
    containerStyle,
    success = true,
    textAlignVertical = 'center',
    icon,
    returnKeyType = 'next',
    blurOnSubmit = false,
    ...inputProps
  } = props;
  return (
    <View
      style={[
        BaseStyle.textInput,
        { backgroundColor: cardColor },
        style,
        containerStyle,
      ]}>
      <TextInput
        {...inputProps}
        ref={ref}
        style={[styles.input, { color: colors.text, fontFamily: font }]}
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        autoCorrect={false}
        placeholderTextColor={success ? BaseColor.grayColor : colors.primary}
        selectionColor={colors.primary}
        textAlignVertical={textAlignVertical}
      />
      {icon}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: '100%',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
