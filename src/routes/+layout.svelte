<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { PRIMARY_COLOR } from '$lib/config';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.style.setProperty('--primary-color', PRIMARY_COLOR);
		}
	});

	// Proteger rotas (exceto login)
	$effect(() => {
		if (auth.initialized && !auth.isAuthenticated && page.url.pathname !== '/login') {
			goto('/login');
		} else if (auth.initialized && auth.isAuthenticated && page.url.pathname === '/login') {
			goto('/');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !auth.initialized}
	<div style="display: flex; height: 100vh; align-items: center; justify-content: center; background: #1a1a1a; color: white;">
		<p>Carregando sistema...</p>
	</div>
{:else if page.url.pathname === '/login'}
	{@render children?.()}
{:else if auth.isAuthenticated}
	{@render children?.()}
{/if}
