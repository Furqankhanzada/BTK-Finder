import React from 'react';
import {
  TextInput,
  View,
  I18nManager,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';

interface Props {
  style?: StyleProp<ViewStyle>;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  value?: string;
  success?: boolean;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad';
  multiline?: boolean;
  textAlignVertical?: 'center' | 'auto' | 'bottom' | 'top' | undefined;
  autoCapitalize?: 'none';
  icon?: JSX.Element;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
  numberOfLines?: number;
}

export default React.forwardRef<TextInput, Props>((props, ref) => {
  const { colors } = useTheme();
  const cardColor = colors.card;
  const {
    style,
    onChangeText,
    onFocus,
    placeholder = 'Placeholder',
    value = '',
    success = true,
    secureTextEntry = false,
    keyboardType = 'default',
    multiline = false,
    textAlignVertical = 'center',
    icon,
    onSubmitEditing,
    autoCapitalize = 'none',
    returnKeyType = 'next',
    blurOnSubmit = false,
    numberOfLines,
  } = props;
  return (
    <View style={[BaseStyle.textInput, { backgroundColor: cardColor }, style]}>
      <TextInput
        ref={ref}
        style={{
          fontFamily: 'Raleway',
          flex: 1,
          height: '100%',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          color: colors.text,
          paddingTop: 5,
          paddingBottom: 5,
        }}
        returnKeyType={returnKeyType}
        onChangeText={(text) => onChangeText(text)}
        blurOnSubmit={blurOnSubmit}
        onFocus={onFocus}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={success ? BaseColor.grayColor : colors.primary}
        secureTextEntry={secureTextEntry}
        value={value}
        autoCapitalize={autoCapitalize}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
      />
      {icon}
    </View>
  );
});
