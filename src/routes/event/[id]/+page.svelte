<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Event - {$page.params.id} - Pondelk!</title>
	<meta name="description" content="Page for event {$page.params.id}" />
</svelte:head>

<h1>Event {$page.params.id}</h1>
