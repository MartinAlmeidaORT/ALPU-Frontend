import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { SkillsQuery } from '../types/graphql';

const SKILL_QUERY = graphql(`
  query skills {
    skills {
      skillId
      name
    }
  }
`);

export async function fetchSkills(): Promise<OperationResult<SkillsQuery>> {
  return await createUrqlClient().query(SKILL_QUERY, {}).toPromise();
}
