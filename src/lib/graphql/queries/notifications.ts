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


