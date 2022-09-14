import { NavigatorScreenParams } from '@react-navigation/native';

import { MainStackParamList } from './MainStackParamList';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Loading: undefined;
  Filter: {
    category?: string | string[];
    popular?: boolean;
    recent?: boolean;
    tags?: string | string[];
  };
  ChooseItems: {
    title: string;
    selected: any;
    items: any;
    onApply: (items: any) => void;
    search?: boolean;
  };
  SearchHistory: undefined;
  SelectDarkOption: undefined;
  SelectFontOption: undefined;
};
