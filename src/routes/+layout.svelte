<script>
	import '../app.css';
	import Footer from '../lib/components/Footer.svelte';
	import Header from '../lib/components/Header.svelte';
</script>

<div class="grid grid-rows-[1fr_min-content] min-h-screen">
	<Header />

	<main class="mt-[calc(var(--nav-height)+2rem)] page-container">
		<slot />
	</main>

	<Footer />
</div>
