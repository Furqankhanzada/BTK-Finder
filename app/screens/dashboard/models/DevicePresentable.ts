export interface DevicePresentable {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  deviceUniqueId: string;
  fcmToken: string;
  os: string;
  osVersion: string;
}
