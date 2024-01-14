<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	export let open = false;
	export let title = 'Are you sure absolutely sure?';
	export let description =
		'This action cannot be undone. This will permanently delete your account and remove your data from our servers.';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<Dialog.Root {open} onOpenChange={() => dispatch('close')}>
	<Dialog.Trigger>
		<slot />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<div class="flex w-full justify-center gap-3 sm:justify-end">
				<DialogPrimitive.Close>
					<Button class="w-full" variant="outline">{cancelText}</Button>
				</DialogPrimitive.Close>
				<Button on:click={() => dispatch('submit')} type="submit">{confirmText}</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
