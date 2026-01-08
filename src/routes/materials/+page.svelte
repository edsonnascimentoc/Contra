	<script lang="ts">
		import { Package } from 'lucide-svelte';
		import { BRAND_NAME } from '$lib/config';
	</script>

	<svelte:head>
		<title>Materials & P&M - {BRAND_NAME}</title>
	</svelte:head>

<div class="app-container">
	<nav class="sidebar">
		<div style="padding: 2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
			<h2 style="margin: 0; color: white; font-size: 1.5rem;">🏗️ {BRAND_NAME}</h2>
			<p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem;">Construction Management</p>
		</div>
		
		<div style="padding: 1rem 0;">
			<a href="/" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📊</span>
				Status Board
			</a>
			<a href="/labor" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">👥</span>
				Labor Management
			</a>
			<a href="/materials" class="nav-item active">
				<Package size={20} style="display: inline; margin-right: 0.75rem;" />
				Materials & P&M
			</a>
			<a href="/daily-updates" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📅</span>
				Daily Updates
			</a>
			<a href="/reports" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📈</span>
				Reports
			</a>
		</div>
	</nav>

	<main class="main-content">
		<div class="header">
			<h1>Materials & Plant & Machinery</h1>
			<p class="subtitle">Em desenvolvimento</p>
		</div>
		
		<div class="card">
			<p>Esta página está em desenvolvimento.</p>
		</div>
	</main>
</div>

<style>
	.app-container {
		display: flex;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.sidebar {
		width: 280px;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		position: fixed;
		height: 100vh;
		overflow-y: auto;
	}

	.nav-item {
		display: flex;
		align-items: center;
		padding: 1rem 1.5rem;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		transition: all 0.3s ease;
		border-left: 3px solid transparent;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.nav-item.active {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		border-left-color: white;
	}

	.main-content {
		margin-left: 280px;
		flex: 1;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
		color: white;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
	}

	.subtitle {
		margin: 0.5rem 0 0 0;
		opacity: 0.9;
	}

	.card {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
</style>
