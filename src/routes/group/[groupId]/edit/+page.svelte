<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { type ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';

	export let data;
	export let form;

	let loading = false;

	async function submitForm() {
		if (loading) return;
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			loading = false;

			if (result.type === 'success') {
				toast.success(result.data?.message);
				return goto(`/group/${$page.params.groupId}`);
			} else if (result.type === 'failure') {
				toast.error(result.data?.message);
			}

			applyAction(result);
		};
	}
</script>

<section class="w-full sm:w-[30rem]">
	<h1 class="heading text-center">Edit group</h1>

	<form
		class="[&>div:not(:last-child)]:mb-3 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
		method="POST"
		action="?/edit"
		use:enhance={submitForm}
	>
		<div>
			<Label for="email-2">Name</Label>
			<Input type="text" id="name" placeholder="Name" name="name" value={data.group.name} />
			{#if form?.errors?.name}
				<p class="text-sm text-destructive">{form.errors.name}</p>
			{/if}
		</div>

		<div>
			<Label for="email-2">Description</Label>
			<Input
				type="text"
				id="description"
				placeholder="Description"
				name="description"
				value={data.group.description}
			/>
			{#if form?.errors?.description}
				<p class="text-sm text-destructive">{form.errors.description}</p>
			{/if}
		</div>

		<Button disabled={loading} class="relative ml-auto flex items-center" type="submit">
			{#if loading}
				<Spinner />
			{/if}
			Save
		</Button>
	</form>
</section>
