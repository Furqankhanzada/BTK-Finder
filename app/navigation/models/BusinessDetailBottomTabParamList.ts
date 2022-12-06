import { NavigatorScreenParams } from '@react-navigation/native';
import { Maybe } from '../../models/graphql';

export type BusinessDetailBottomTabParamList = {
  DetailStack: NavigatorScreenParams<ProductStackParamList>;
  ReviewStack: NavigatorScreenParams<ReviewStackParamList>;
  Products: { businessId: string };
};

export type ReviewStackParamList = {
  Reviews: { businessId: string };
  AddReview: { businessId: string };
};

export type ProductStackParamList = {
  Overview: { businessId: string };
  Product: {
    businessId: string | undefined;
    productSlug: Maybe<string> | undefined;
  };
};

export type ProductStackParamList = {
  Overview: { id: string };
  Product: {
    businessId: string | undefined;
    productSlug: Maybe<string> | undefined;
  };
};
