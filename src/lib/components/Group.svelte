<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Group } from '$lib/types/model.types';
	import { getLocalTime } from '$lib/utils/time';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createEventDispatcher } from 'svelte';
	dayjs.extend(relativeTime);

	export let group: Group;
	export let isAuthenticated: boolean;

	$: isGroupMember = group.pending === false && isAuthenticated;

	const dispatch = createEventDispatcher();
</script>

<a href={isGroupMember ? `/group/${group.id}` : 'javascript:void(0)'}>
	<Card.Root class="transition-all {isGroupMember ? 'hover:bg-secondary' : 'cursor-default'}">
		<Card.Header>
			<div class="flex w-full justify-between">
				<h2 class="font-semibold">{group.name}</h2>
				<div>
					{#if isGroupMember}
						<span class="text-sm font-bold text-green-500">Joined</span>
					{:else if group.pending && isAuthenticated}
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
				<p class="text-sm text-foreground/60">{dayjs(getLocalTime(group.createdAt)).fromNow()}</p>
			</div>
		</Card.Footer>
	</Card.Root>
</a>
