<script>
	import { authData } from '$lib/stores/auth';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import Footer from '../lib/components/Footer.svelte';
	import Header from '../lib/components/Header.svelte';

	export let data;

	authData.set(data.authData);
</script>

<Toaster />

<div class="grid min-h-screen grid-rows-[1fr_min-content]">
	<Header />

	<main
		class="page-container mt-[calc(var(--nav-height)+2rem)] flex min-w-full flex-col items-center"
	>
		<slot />
	</main>

	<Footer />
</div>
