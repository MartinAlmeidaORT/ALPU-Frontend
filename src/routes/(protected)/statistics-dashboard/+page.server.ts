export async function load({ locals }: { locals: App.Locals }) {
  return { token: locals.token };
}