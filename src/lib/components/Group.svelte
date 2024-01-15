<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Group } from '$lib/types/model.types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let group: Group;

	function requestInvite() {
		console.log('request invite');
	}
</script>

<a href={group.joined ? `/group/${group.id}` : 'javascript:void(0)'}>
	<Card.Root class="transition-all {group.joined ? 'hover:bg-secondary' : 'cursor-default'}">
		<Card.Header>
			<div class="flex w-full justify-between">
				<h2 class="font-semibold">{group.name}</h2>
				<div>
					{#if group.joined}
						<span class="text-sm font-bold text-green-500">Joined</span>
					{:else}
						<Button variant="outline" size="sm" on:click={requestInvite}>Request invite</Button>
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
