export async function load({ url }) {
  const pendingState = url.searchParams.get('pendingState') === 'true';

  return {
    pendingState
  };
}