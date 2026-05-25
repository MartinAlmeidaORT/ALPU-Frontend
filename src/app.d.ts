import type { User } from '$lib/graphql/schema';
import type { Client } from '@urql/core';
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      urql: Client;
      user: User | null | undefined;
      token: string | null | undefined;
      rol: string | null | undefined;
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
