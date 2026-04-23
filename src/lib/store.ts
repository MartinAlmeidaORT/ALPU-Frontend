import { writable } from 'svelte/store';

export interface User {
	userId?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	accountType?: 'Client' | 'Broadcaster';
	[key: string]: any;
}

export const usuario = writable<User>({});
