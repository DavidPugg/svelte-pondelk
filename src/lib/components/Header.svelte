<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { authData } from '$lib/stores/auth';
	import toast from 'svelte-french-toast';
	import Profile from './Profile.svelte';
	import Button from './ui/button/button.svelte';
	import DropdownMenuItem from './ui/dropdown-menu/dropdown-menu-item.svelte';

	async function logout() {
		await fetch('/api/logout', { method: 'POST' });
		toast.success('Logged out successfully!');
		authData.set(null);
	}
</script>

<header
	class="page-paddings fixed inset-0 z-50 flex h-nav items-center border-b-2 bg-white font-bold"
>
	<nav class="mx-auto flex w-full items-center justify-between">
		<a href="/">Pondelk</a>
		<ul class="flex items-center gap-3">
			{#if $authData}
				<li>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button class="h-11" variant="outline" builders={[builder]}>
								<Profile
									withUsername
									username={$authData.username}
									avatar={$authData.picture ?? ''}
								/>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-44">
							<DropdownMenu.Group class="[&_div]:cursor-pointer">
								<DropdownMenuItem on:click={logout}>Logout</DropdownMenuItem>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>
			{:else}
				<li>
					<Button variant="outline" href="/signup">Sign Up</Button>
				</li>
			{/if}
		</ul>
	</nav>
</header>
