import { writable } from 'svelte/store';
import type { UserDB } from '../../db/schema';

export const authData = writable<Omit<UserDB, 'createdAt'> | null>(null);
