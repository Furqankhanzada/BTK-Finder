import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface BannerPresentable {
  title?: string;
  titleStyle?: StyleProp<Text>;
  description?: string;
  descriptionStyle?: StyleProp<TextStyle>;
  buttonText?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  image: string;
  businessId: string;
}

export interface BannersPresentable {
  one?: BannerPresentable;
  two?: BannerPresentable;
  three?: BannerPresentable;
  four?: BannerPresentable;
}
