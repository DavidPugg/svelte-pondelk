<script lang="ts">
	import Group from '$lib/components/Group.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PAGE_TITLE } from '$lib/utils/constants';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<svelte:head>
	<title>Home - {PAGE_TITLE}</title>
	<meta name="description" content="Home page of Pondelk!" />
</svelte:head>

<section class="w-full sm:w-[30rem]">
	<div class="mb-3 flex justify-between">
		<h1 class="heading">Groups</h1>

		<a href="/group/new">
			<Button variant="outline">New Group</Button>
		</a>
	</div>

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
