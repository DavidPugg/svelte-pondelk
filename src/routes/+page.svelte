<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import Group from '$lib/components/Group.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { authData } from '$lib/stores/auth';
	import { PAGE_TITLE } from '$lib/utils/constants';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let submitButton: HTMLButtonElement;
	let groupIdInput: HTMLInputElement;

	let loading = false;

	function submitRequestForm() {
		if (loading) return;
		loading = true;

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			loading = false;

			if (result.type === 'success') {
				toast.success(result.data?.message);
				return update();
			} else if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			applyAction(result);
		};
	}
</script>

<svelte:head>
	<title>Home - {PAGE_TITLE}</title>
	<meta name="description" content="Home page of Pondelk!" />
</svelte:head>

<section class="w-full sm:w-[30rem]">
	<div class="mb-6 flex justify-between border-b-2 pb-3">
		<h1 class="heading">Groups</h1>

		{#if $authData}
			<a href="/group/new">
				<Button variant="outline">New Group</Button>
			</a>
		{/if}
	</div>

	{#if !!data?.groups.length}
		<form method="POST" action="?/request" use:enhance={submitRequestForm}>
			<ul class="flex flex-col gap-4">
				{#each data.groups as group}
					<li>
						<Group
							on:requestInvite={() => {
								groupIdInput.value = `${group.id}`;
								submitButton.click();
							}}
							{group}
							isAuthenticated={$authData !== null}
						/>
					</li>
				{/each}
			</ul>

			<input bind:this={groupIdInput} type="hidden" name="group-id" />
			<button bind:this={submitButton} type="submit" class="hidden" aria-hidden="true"></button>
		</form>
	{:else}
		<div class="text-center text-lg font-semibold text-foreground/60">No groups yet!</div>
	{/if}
</section>
