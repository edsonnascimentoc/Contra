<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { PRIMARY_COLOR } from '$lib/config';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.style.setProperty('--primary-color', PRIMARY_COLOR);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
