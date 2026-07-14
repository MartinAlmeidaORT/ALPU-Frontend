import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { LanguagesQuery } from '../types/graphql';

const LANGUAGE_QUERY = graphql(`
  query languages {
    languages {
      languageId
      name
    }
  }
`);

export async function fetchLanguages(): Promise<
  OperationResult<LanguagesQuery>
> {
  return await createUrqlClient().query(LANGUAGE_QUERY, {}).toPromise();
}
