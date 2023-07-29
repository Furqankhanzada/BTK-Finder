import { NavigatorScreenParams } from '@react-navigation/native';
import { Membership } from '@screens/settings/profile/models/UserPresentable';
import { Maybe } from '../../models/graphql';

export type BusinessDetailBottomTabParamList = {
  DetailStack: NavigatorScreenParams<ProductStackParamList>;
  ReviewStack: NavigatorScreenParams<ReviewStackParamList>;
  Products: { businessId: string };
  MembersStack: NavigatorScreenParams<MembersStackParamList>;
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

export type MembersStackParamList = {
  Members: { businessId: string };
  EditMember: { businessId: string; membership: Membership };
  AddMember: { businessId: string };
  PackageSelect: { businessId: string };
};
