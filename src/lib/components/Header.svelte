<script lang="ts">
	import { authData } from '$lib/stores/auth';
	import toast from 'svelte-french-toast';
	import Button from './ui/button/button.svelte';

	async function logout() {
		await fetch('/api/logout', { method: 'POST' });
		toast.success('Logged out successfully!');
		authData.set(null);
	}
</script>

<header
	class="page-paddings fixed inset-0 z-50 flex h-nav items-center border-b-2 bg-secondary font-bold"
>
	<nav class="mx-auto flex w-full items-center justify-between">
		<a href="/">Pondelk</a>
		<ul class="flex items-center gap-3">
			{#if $authData}
				<li>
					<Button variant="outline" on:click={logout}>Logout</Button>
				</li>
			{:else}
				<li>
					<a href="/signup">Sign Up</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>
