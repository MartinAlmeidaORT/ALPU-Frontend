import type { OperationResult } from "@urql/core";
import type { DepartmentsQuery } from "../types/graphql";
import { graphql } from "../types";
import { createUrqlClient } from "$lib/graphql/client";

const DEPARTMENTS_QUERY = graphql(`
    query departments($countryCode: String!) {
        departments(where: {countryCode: {eq: $countryCode}}) {
          departmentId
          name
        }
    }
`);

export async function fetchDepartments(countryCode: string): Promise<OperationResult<DepartmentsQuery>> {
  return await createUrqlClient().query(DEPARTMENTS_QUERY, { countryCode }).toPromise();
}