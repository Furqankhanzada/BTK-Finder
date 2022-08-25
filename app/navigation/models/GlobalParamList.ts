import { RootStackParamList } from './RootStackParamList';
import { MainStackParamList } from './MainStackParamList';
import { MainBottomTabParamList } from './MainBottomTabParamList';
import {
  BusinessDetailBottomTabParamList,
  ReviewStackParamList,
} from './BusinessDetailBottomTabParamList';

export type GlobalParamList = RootStackParamList &
  MainStackParamList &
  MainBottomTabParamList &
  BusinessDetailBottomTabParamList &
  ReviewStackParamList;
