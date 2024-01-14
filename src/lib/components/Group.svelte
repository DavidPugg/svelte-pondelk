<script lang="ts">
	import type { Group } from '$lib/types/model.types';
	import * as Card from '$lib/components/ui/card';

	export let group: Group;
</script>

<a href="/group/{group.id}">
	<Card.Root>
		<Card.Header>
			<h2>{group.name}</h2>
		</Card.Header>
		<Card.Footer>
			<p>{group.createdAt}</p>
		</Card.Footer>
	</Card.Root>
</a>
