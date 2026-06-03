import {
  BILLS_QUERY,
  GENERATE_BILL_MUTATION,
} from '$lib/graphql/queries/bills.js';
import type { TableBill } from './columns.js';
import { createUrqlClient } from '$lib/graphql/client';

export async function load({ locals, url }: { locals: App.Locals; url: URL }) {
  try {
    const after = url.searchParams.get('after') || null;
    let result = await locals.urql
        .query(
          BILLS_QUERY,
          { first: 5, after },
          { requestPolicy: 'network-only' },
        )
        .toPromise();

    if (result.error) {
      return {
        token: locals.token,
        bills: [],
        error: `GraphQL Error: ${result.error.message}`,
      };
    }

    if (!result.data) {
      return {
        token: locals.token,
        bills: [],
        error: 'No data returned from GraphQL',
      };
    }

    const bills = (result.data?.bills?.nodes || []) as TableBill[];

    return {
      token: locals.token,
      bills: bills,
      pageInfo: result.data?.bills?.pageInfo,
      totalCount: result.data?.bills?.totalCount || 0,
    };
  } catch (error) {
    return {
      token: locals.token,
      bills: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const actions = {
  default: async ({ request, cookies, locals }) => {
    try {
      const formData = await request.formData();
      const file = formData.get("receiptImage") as File | null;
      
      const billData = {
        title: formData.get("name") as string,
        description: formData.get("description") as string,
        amount: parseFloat(formData.get("amount") as string),
        type: (formData.get("type") as string).toUpperCase(),
        date: new Date().toISOString().split('T')[0], // yyyy-mm-dd format for LocalDate
        fileName: file ? file.name : '',
        contractId: formData.get("contractId") ? parseInt(formData.get("contractId") as string) : null
      };

      const result = await createUrqlClient(locals.token)
        .mutation(GENERATE_BILL_MUTATION, {
          input: billData,
        })
        .toPromise();

      // Handle GraphQL-specific errors
      if (result.error) {
        return { error: result.error.message };
      }

      const s3Url = result.data?.registerBill?.amazonS3Url;
      if (file && s3Url) {
        const response = await fetch(s3Url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        });

        if (!response.ok) {
           return { error: "Failed to upload file to S3." }
        }
      }

      return { success: true };
      
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }

  },
};
