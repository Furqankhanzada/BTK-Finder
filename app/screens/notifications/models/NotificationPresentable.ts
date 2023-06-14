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
  video?: string;
  link?: string;
  type: NotificationType;
  read?: boolean;
  userId?: string;
}

export interface NotificationCountPresentable {
  unread: number;
}
