<script>
	import '../app.css';
	import Footer from '../lib/components/Footer.svelte';
	import Header from '../lib/components/Header.svelte';
</script>

<div class="grid min-h-screen grid-rows-[1fr_min-content]">
	<Header />

	<main
		class="page-container mt-[calc(var(--nav-height)+2rem)] flex min-w-full flex-col items-center"
	>
		<slot />
	</main>

	<Footer />
</div>
