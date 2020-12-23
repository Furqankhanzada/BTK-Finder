import React from 'react';
import { TextInput, View, I18nManager } from 'react-native';
import PropTypes from 'prop-types';
import { BaseStyle, BaseColor, useTheme } from '@config';
const Index = React.forwardRef((props, ref) => {
  const { colors } = useTheme();
  const cardColor = colors.card;
  const {
    style,
    onChangeText,
    onFocus,
    placeholder,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    icon,
    onSubmitEditing,
    autoCapitalize,
    returnKeyType,
    blurOnSubmit,
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
        onFocus={() => onFocus()}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={success ? BaseColor.grayColor : colors.primary}
        secureTextEntry={secureTextEntry}
        value={value}
        autoCapitalize={autoCapitalize}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
      />
      {icon}
    </View>
  );
});
export default Index;
Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeText: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  success: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  autoCapitalize: PropTypes.string,
  icon: PropTypes.node,
  onSubmitEditing: PropTypes.func,
  returnKeyType: PropTypes.string,
  blurOnSubmit: PropTypes.bool,
};

Index.defaultProps = {
  style: {},
  onChangeText: (text) => {},
  onFocus: () => {},
  placeholder: 'Placeholder',
  autoCapitalize: 'none',
  value: '',
  success: true,
  secureTextEntry: false,
  keyboardType: 'default',
  multiline: false,
  textAlignVertical: 'center',
  icon: null,
  onSubmitEditing: () => {},
  returnKeyType: 'next',
  blurOnSubmit: false,
};
