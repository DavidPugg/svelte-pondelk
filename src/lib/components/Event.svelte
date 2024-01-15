<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Event } from '$lib/types/model.types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let event: Event;
</script>

<a href="/event/{event.id}">
	<Card.Root class="transition-all hover:bg-secondary">
		<Card.Header>
			<div class="flex w-full justify-between">
				<h2 class="font-semibold">{event.name}</h2>
			</div>
		</Card.Header>
		<Card.Footer>
			<div class="flex w-full justify-between">
				<p class="text-sm text-foreground/60">{event.location}</p>
				<p class="text-sm text-foreground/60">{dayjs(event.createdAt).fromNow()}</p>
			</div>
		</Card.Footer>
	</Card.Root>
</a>
