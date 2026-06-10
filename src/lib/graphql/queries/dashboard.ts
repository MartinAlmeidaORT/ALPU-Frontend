import { graphql } from '../types';

export const DASHBOARD_QUERY = graphql(`
  query dashboard {
    dashboard {
      totalIncome
      totalExpense
      topClientsByContracts {
        user {
          userId
          email
        }
        contracts
      }
      topBroadcasterByContracts {
        user {
          firstName
          lastName
        }
        contracts
      }
      topClientsByPaidContracts {
        firstName
        lastName
        paidContracts
      }
      monthlyPaidGroup {
        month
        clients {
          firstName
          lastName
          clientId
          email
          paidContracts
        }
      }
      monthlyDelinquentsGroup {
        month
        clients {
          firstName
          lastName
          email
          lateContracts
        }
      }
    }
  }
`);
