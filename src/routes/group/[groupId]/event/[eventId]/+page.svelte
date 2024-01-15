<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let openDialog = false;
	let submitButton: HTMLButtonElement;

	let dialogText = {
		title: 'Are you sure you want to delete this event?"',
		description:
			'This action cannot be undone. This will permanently delete your event and remove your data from our servers.',
		confirm: 'Delete',
		cancel: 'Cancel'
	};
</script>

<svelte:head>
	<title>Event - {$page.params.id} - Pondelk!</title>
	<meta name="description" content="Page for event {$page.params.id}" />
</svelte:head>

<section class="mb-4 w-full border-b-2 pb-4 sm:w-[30rem]">
	<div class="mb-2 flex justify-between">
		<h1 class="heading">{data.event?.name}</h1>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">• • •</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Group>
					<DropdownMenu.Item on:click={() => (openDialog = true)}
						><span class="text-red-500">Delete group</span></DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<form
		method="POST"
		action={`?/delete`}
		class="hidden"
		use:enhance={() => {
			openDialog = false;
		}}
	>
		<ConfirmDialog
			open={openDialog}
			on:close={() => (openDialog = false)}
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
	<Table.Root>
		<Table.Caption>A list of the event participations.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">User</Table.Head>
				<Table.Head class="text-right">Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if data.event?.participations}
				{#each data.event.participations as participation, i (i)}
					<Table.Row>
						<Table.Cell class="font-medium">{participation.user?.username}</Table.Cell>
						{#if participation.verified}
							<Table.Cell class="text-right font-semibold text-green-500">verified</Table.Cell>

							<!-- TODO: fix admin after auth -->
						{:else if false}
							<Table.Cell class="text-right ">
								<form method="POST" action={`?/verify`} use:enhance>
									<input type="text" name="id" value={participation.user?.id} class="hidden" />
									<Button type="submit" variant="outline" size="sm">Verify</Button>
								</form>
							</Table.Cell>
						{:else}
							<Table.Cell class="text-right font-semibold text-destructive">not verified</Table.Cell
							>
						{/if}
					</Table.Row>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</section>
