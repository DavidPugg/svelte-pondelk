<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { PageServerData } from './$types';

	import { goto } from '$app/navigation';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Event from '$lib/components/Event.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { authData } from '$lib/stores/auth';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { deleteText, leaveText } from './confirm-dialog-text';

	export let data: PageServerData;

	let submitButton: HTMLButtonElement;
	let openDialog: 'leave' | 'delete' | null = null;
	let openTab: 'events' | 'members' = 'events';

	$: dialogText = openDialog === 'leave' ? leaveText : deleteText;
	$: isAdmin = $authData?.id === data.group?.authorId;

	function submitForm() {
		const func = openDialog == 'delete' ? deleteForm() : leaveForm();
		openDialog = null;
		return func;
	}

	function deleteForm() {
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message);
				return goto('/');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			applyAction(result);
		};
	}

	function leaveForm() {
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message);
				return goto('/');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			applyAction(result);
		};
	}
</script>

<svelte:head>
	<title>Group - {$page.params.groupId} - Pondelk!</title>
	<meta name="description" content="Page for group {$page.params.groupId}" />
</svelte:head>

<div
	class="grid w-full grid-rows-[min-content_1fr] gap-x-6 sm:max-w-[40rem] sm:grid-cols-[1fr_min-content]"
>
	<section class="mb-3 border-b-2 pb-3 sm:mb-6">
		<div class="mb-2 flex justify-between">
			<h1 class="heading">{data.group?.name}</h1>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline">• • •</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Group class="[&_div]:cursor-pointer">
						<a href="/group/{data.group?.id}/event/new">
							<DropdownMenu.Item>Create event</DropdownMenu.Item></a
						>

						{#if isAdmin}
							<a href="/group/{data.group?.id}/edit">
								<DropdownMenu.Item>Edit group</DropdownMenu.Item>
							</a>
						{/if}
						<DropdownMenu.Item on:click={() => (openDialog = 'leave')}>
							<span class="text-red-500">Leave group</span>
						</DropdownMenu.Item>

						{#if isAdmin}
							<DropdownMenu.Item on:click={() => (openDialog = 'delete')}
								><span class="text-red-500">Delete group</span></DropdownMenu.Item
							>
						{/if}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		<p class="text-sm">{data.group?.description}</p>

		<form method="POST" action={`?/${openDialog}`} class="hidden" use:enhance={submitForm}>
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

	<Tabs.Root value={openTab} class="mx-auto mb-3 block sm:hidden">
		<Tabs.List>
			<Tabs.Trigger on:click={() => (openTab = 'events')} value="events">Events</Tabs.Trigger>
			<Tabs.Trigger on:click={() => (openTab = 'members')} value="members">Members</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<section class={`${openTab === 'events' && '!block'} hidden sm:col-start-1 sm:block`}>
		<ul class="flex flex-col gap-4">
			{#if !!data?.group?.events?.length}
				{#each data.group.events as event}
					<li>
						<Event {event} />
					</li>
				{/each}
			{:else}
				<div class="text-center text-lg font-semibold text-foreground/60">No events yet!</div>
			{/if}
		</ul>
	</section>

	<section
		class={`${openTab === 'members' && '!block'} hidden sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:block`}
	>
		<h2 class="mb-3 text-center text-lg font-semibold">Members</h2>
		<ul class="flex flex-col items-center gap-4">
			{#if !!data?.group?.members?.length}
				{#each data.group.members as membership}
					<li>
						<Button
							variant="outline"
							class={`h-11 ${$authData?.id === membership.userId && 'bg-secondary'}`}
						>
							<Profile
								withUsername
								username={membership.user.username}
								avatar={membership.user.picture ?? ''}
							/>
						</Button>
					</li>
				{/each}
			{/if}
		</ul>
	</section>
</div>
