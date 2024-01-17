import type { AuthData } from '$lib/types/auth';
import { writable } from 'svelte/store';

export const authData = writable<AuthData | null>(null);
