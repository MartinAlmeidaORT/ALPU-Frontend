import type { User } from '$lib/components/types';
import type { Client } from '@urql/core';
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      urql: Client;
      user: User | null | undefined;
      token: string | null | undefined;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
