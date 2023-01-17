export enum NotificationType {
  ANNOUNCEMENT = 'Announcement',
  BUSINESS = 'Business',
  USER = 'User',
  REVIEW = 'Review',
}

export interface NotificationPresentable {
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  type?: NotificationType;
  read?: boolean;
  ownerId?: string;
}
