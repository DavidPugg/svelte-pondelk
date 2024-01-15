<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';

	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;

	async function submitForm() {
		if (loading) return;
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			loading = false;

			if (result.type === 'success') {
				toast.success('Successfully created event');
				return goto(`/group/${$page.params.groupId}/event/${result.data?.insertedId}`);
			}

			toast.error('Failed to create event');

			applyAction(result);
		};
	}
</script>

<section class="w-full sm:w-[30rem]">
	<h1 class="heading text-center">Create Event</h1>

	<form
		class="[&>div:not(:last-child)]:mb-3 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
		method="POST"
		action="?/create"
		use:enhance={submitForm}
	>
		<div>
			<Label for="email-2">Name</Label>
			<Input type="text" id="name" placeholder="Name" name="name" />
			{#if form?.errors?.name}
				<p class="text-sm text-destructive">{form.errors.name}</p>
			{/if}
		</div>

		<div>
			<Label for="email-2">Location</Label>
			<Input type="text" id="location" placeholder="Location" name="location" />
			{#if form?.errors?.location}
				<p class="text-sm text-destructive">{form.errors.location}</p>
			{/if}
		</div>

		<Button disabled={loading} class="relative ml-auto flex items-center" type="submit">
			{#if loading}
				<Spinner />
			{/if}
			Create
		</Button>
	</form>
</section>
