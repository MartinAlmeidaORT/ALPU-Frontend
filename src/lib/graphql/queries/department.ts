import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { DepartmentsQuery } from '../types/graphql';

const DEPARTMENTS_QUERY = graphql(`
  query departments($countryCode: String!) {
    departments(where: { countryCode: { eq: $countryCode } }) {
      departmentId
      name
    }
  }
`);

export async function fetchDepartments(
  countryCode: string,
): Promise<OperationResult<DepartmentsQuery>> {
  return await createUrqlClient()
    .query(DEPARTMENTS_QUERY, { countryCode })
    .toPromise();
}
