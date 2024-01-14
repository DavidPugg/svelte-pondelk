<script lang="ts">
	import { PAGE_TITLE } from '$lib/utils/constants';
	import type { PageServerData } from './$types';
	import Group from '$lib/components/Group.svelte';

	export let data: PageServerData;
</script>

<svelte:head>
	<title>Home - {PAGE_TITLE}</title>
	<meta name="description" content="Home page of Pondelk!" />
</svelte:head>

<section class="w-full sm:w-[30rem]">
	<h1 class="heading">Groups</h1>

	{#if data?.groups}
		<ul class="flex flex-col gap-4">
			{#each data.groups as group}
				<li><Group {group} /></li>
			{/each}
		</ul>
	{:else}
		<p>No groups yet!</p>
	{/if}
</section>
