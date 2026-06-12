import { graphql } from '../types';

export const NOTIFICATIONS_QUERY = graphql(`
  query notifications {
    notifications {
      notificationId
      userId
      title
      description
      date
      isRead
    }
  }
`);

export const NOTIFICATION_SUB = graphql(`
  subscription OnNotificationAdded {
    onNotificationAdded {
      notificationId
      userId
      title
      description
      date
      isRead
    }
  }
`);

export const DELETE_NOTIFICATION_MUTATION = graphql(`
  mutation deleteNotification($notificationId: Int!) {
    deleteNotification(notificationId: $notificationId) {
      notificationId
      title
      date
    }
  }
`);

export const DELETE_ALL_NOTIFICATIONS_MUTATION = graphql(`
  mutation clearNotifications {
    clearNotifications {
      notificationId
    }
  }
`);
