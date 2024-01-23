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
  duration: string;
  amount: number;
}

export interface Membership {
  startedAt: Date;
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

interface MemberBase extends UserPresentable {
  membership: Membership;
}

export type Member = Omit<
  MemberBase,
  'phone' | 'resident' | 'status' | 'roles' | 'memberships'
>;
