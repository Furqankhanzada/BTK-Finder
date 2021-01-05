import { BaseStyle, useTheme, BaseColor } from '@config';

export const colors = {
  primary: '#5dade2',
  unselected: '#2e3742',
  actIndicator: '#2e3742',
  error: 'red',
  baseColor: useTheme.cardColor,
  textColor: useTheme.text,
};

export const ITEMLAYOUT = 40;

export const defaultDropdownProps = {
  primaryColor: colors.primary,
  enableSearch: false,
  error: false,
  floating: false,
  required: false,
  disabled: false,
  elevation: 2,
  borderRadius: 2,
  activityIndicatorColor: colors.actIndicator,
  searchPlaceholder: 'Search',
  helperText: '',
  errorColor: colors.error,
  itemTextStyle: {},
  showLoader: false,
  animationInTiming: 400,
  animationOutTiming: 400,
  headerContainerStyle: {},
  headerTextStyle: {},
  stickySectionHeadersEnabled: true,
  parentDDContainerStyle: {},
  itemContainerStyle: {},
  rippleColor: 'rgba(0,0,0,0.1)',
  disableSort: false,
  enableAvatar: false,
  avatarSize: 30,
  emptySelectionText: 'Selected items will appear here...',
  mainContainerStyle: {},
  underlineColor: undefined,
  disableSelectionTick: false,
  textInputPlaceholder: undefined,
  textInputPlaceholderColor: undefined,
  selectedItemTextStyle: {},
  selectedItemViewStyle: {},
  removeLabel: false,
};
