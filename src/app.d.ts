// See https://kit.svelte.dev/docs/types#app

import type { AuthData } from "$lib/types/auth";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authData: AuthData
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
