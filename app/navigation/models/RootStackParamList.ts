import { NavigatorScreenParams } from '@react-navigation/native';

import { MainStackParamList } from './MainStackParamList';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Loading: undefined;
  HelpLine: undefined;
  Filter: undefined;
  ChooseItems: undefined;
  SearchHistory: undefined;
  SelectDarkOption: undefined;
  SelectFontOption: undefined;
};
