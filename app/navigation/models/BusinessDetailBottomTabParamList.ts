import { NavigatorScreenParams } from '@react-navigation/native';
import { Maybe } from '../../models/graphql';

export type BusinessDetailBottomTabParamList = {
  DetailStack: NavigatorScreenParams<ProductStackParamList>;
  ReviewStack: NavigatorScreenParams<ReviewStackParamList>;
  Products: { id: string };
};

export type ReviewStackParamList = {
  Reviews: { id: string };
  AddReview: { id: string };
};

export type ProductStackParamList = {
  Overview: { id: string };
  Product: {
    businessId: string | undefined;
    productSlug: Maybe<string> | undefined;
  };
};
