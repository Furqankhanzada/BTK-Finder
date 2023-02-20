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

export interface UserPresentable {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  resident: true;
  status: UserStatus;
  roles: Roles;
}
