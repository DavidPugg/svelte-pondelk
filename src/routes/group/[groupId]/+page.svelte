<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';

	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Event from '$lib/components/Event.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { authData } from '$lib/stores/auth';
	import { deleteText, leaveText } from './confirm-dialog-text';

	export let data: PageServerData;

	let openDialog: 'leave' | 'delete' | null = null;
	$: dialogText = openDialog === 'leave' ? leaveText : deleteText;

	let submitButton: HTMLButtonElement;
</script>

<svelte:head>
	<title>Group - {$page.params.id} - Pondelk!</title>
	<meta name="description" content="Page for group {$page.params.id}" />
</svelte:head>

<section class="mb-4 w-full border-b-2 pb-4 sm:w-[30rem]">
	<div class="mb-2 flex justify-between">
		<h1 class="heading">{data.group?.name}</h1>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">• • •</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Group>
					<DropdownMenu.Item
						><a href="/group/{data.group?.id}/event/new">Create event</a></DropdownMenu.Item
					>
					<DropdownMenu.Item on:click={() => (openDialog = 'leave')}>
						<span class="text-red-500">Leave group</span>
					</DropdownMenu.Item>

					{#if $authData?.id === data.group?.authorId}
						<DropdownMenu.Item><span>Edit group</span></DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => (openDialog = 'delete')}
							><span class="text-red-500">Delete group</span></DropdownMenu.Item
						>
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<p class="text-sm">{data.group?.description}</p>

	<form
		method="POST"
		action={`?/${openDialog}`}
		class="hidden"
		use:enhance={() => {
			openDialog = null;
		}}
	>
		<ConfirmDialog
			open={!!openDialog}
			on:close={() => (openDialog = null)}
			on:submit={() => submitButton.click()}
			title={dialogText.title}
			description={dialogText.description}
			confirmText={dialogText.confirm}
			cancelText={dialogText.cancel}
		/>

		<button bind:this={submitButton} type="submit" class="hidden" aria-hidden="true"></button>
	</form>
</section>

<section class="w-full sm:w-[30rem]">
	<ul class="flex flex-col gap-4">
		{#if !!data?.group?.events?.length}
			{#each data.group.events as event}
				<li>
					<Event {event} />
				</li>
			{/each}
		{:else}
			<p>No events yet!</p>
		{/if}
	</ul>
</section>
