<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { authData } from '$lib/stores/auth';
	import { type ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
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

	let loading = false;

	function submitParticipationForm() {
		if (loading) return;
		loading = true;

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			loading = false;

			if (result.type === 'success') {
				toast.success('Successfully participated in event');
				update();
			} else if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			applyAction(result);
		};
	}

	function submitVerifyForm() {
		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				toast.success('Succesfully verified participation ');
				update();
			} else if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			applyAction(result);
		};
	}
</script>

<svelte:head>
	<title>Event - {$page.params.eventId} - Pondelk!</title>
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
						><span class="text-red-500">Delete event</span></DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<p class="font-semibold text-gray-500">{data.event?.location}</p>

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
	<form method="POST" action="?/participate" use:enhance={submitParticipationForm}>
		<Button disabled={loading} type="submit" class="mb-3 ml-auto block" variant="outline">
			{#if loading}
				<Spinner />
			{/if}
			Participate</Button
		>
	</form>

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
						{:else if $authData?.id === data.event?.authorId}
							<Table.Cell class="text-right ">
								<form method="POST" action={`?/verify`} use:enhance={submitVerifyForm}>
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
