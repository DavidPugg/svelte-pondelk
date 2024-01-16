<script lang="ts">
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { authData } from '$lib/stores/auth';
	import toast from 'svelte-french-toast';

	export let data;

	if (data.authData) {
		authData.set(data.authData);
		toast.success('Logged in successfully!');
	}

	if (typeof window !== 'undefined') {
		goto('/');
	}
</script>

<section class="flex h-full w-full items-center justify-center">
	<Spinner className="!relative !left-0" size="xl" />
</section>
