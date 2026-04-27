import { writable, derived } from "svelte/store";

interface AuthUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export const currentUser = writable<AuthUser | null>(null);
export const isAuthenticated = derived(currentUser, ($user) => !!$user);

export function setUser(user: AuthUser) {
  currentUser.set(user);
}

export function clearUser() {
  currentUser.set(null);
}
