export interface NotificationPresentable {
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  type?: string;
  read?: boolean;
  ownerId?: string;
}
