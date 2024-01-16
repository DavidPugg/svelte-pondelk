<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Group } from '$lib/types/model.types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createEventDispatcher } from 'svelte';
	dayjs.extend(relativeTime);

	export let group: Group;

	const dispatch = createEventDispatcher();
</script>

<a href={group.pending === false ? `/group/${group.id}` : 'javascript:void(0)'}>
	<Card.Root
		class="transition-all {group.pending === false ? 'hover:bg-secondary' : 'cursor-default'}"
	>
		<Card.Header>
			<div class="flex w-full justify-between">
				<h2 class="font-semibold">{group.name}</h2>
				<div>
					{#if group.pending === false}
						<span class="text-sm font-bold text-green-500">Joined</span>
					{:else if group.pending}
						<span class="text-sm font-bold text-yellow-500">Requested</span>
					{:else}
						<Button
							variant="outline"
							size="sm"
							on:click={() => dispatch('requestInvite', { groupId: group.id })}
							>Request invite</Button
						>
					{/if}
				</div>
			</div>
		</Card.Header>
		<Card.Footer>
			<div class="flex w-full justify-between">
				<p class="text-sm text-foreground/60">{group.members} members</p>
				<p class="text-sm text-foreground/60">{dayjs(group.createdAt).fromNow()}</p>
			</div>
		</Card.Footer>
	</Card.Root>
</a>
