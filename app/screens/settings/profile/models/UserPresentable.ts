export enum UserStatus {
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum MembershipStatus {
  ACTIVE = 'active',
  ARCHIVE = 'archive',
}

export interface Package {
  id: string;
  name: string;
}

export interface Membership {
  billingDate: Date;
  businessId: string;
  email: string;
  package: Package;
  status: MembershipStatus;
}

export interface UserPresentable {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  resident: true;
  status: UserStatus;
  roles: Roles;
  memberships: Array<Membership>;
}

export type Member = Omit<
  UserPresentable,
  'phone' | 'resident' | 'status' | 'roles'
>;
