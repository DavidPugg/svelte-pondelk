<script lang="ts">
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';

	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
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

<section class="w-full sm:w-[30rem]">
	<div class="flex justify-between">
		<h1 class="heading">{data.group?.name}</h1>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">• • •</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Group>
					<!--TODO: fix after auth is added -->
					<DropdownMenu.Item on:click={() => (openDialog = 'leave')}>
						<span class="text-red-500">Leave group</span>
					</DropdownMenu.Item>

					<DropdownMenu.Item><span>Edit group</span></DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => (openDialog = 'delete')}
						><span class="text-red-500">Delete group</span></DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<form
		use:enhance
		method="POST"
		action={`?/${openDialog}`}
		on:submit|preventDefault={() => (openDialog = null)}
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
