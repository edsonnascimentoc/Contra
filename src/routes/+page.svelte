<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/login');
	});
</script>

<div class="loading-container">
	<p>Redirecting to login...</p>
</div>

<style>
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		font-size: 18px;
		color: #718096;
	}
</style>
