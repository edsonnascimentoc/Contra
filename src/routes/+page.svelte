<script lang="ts">
	import { onMount } from 'svelte';
	import { Building, Users, Package, Activity, Calendar, TrendingUp } from 'lucide-svelte';
	import { fetchAPI } from '$lib/api';
	import { BRAND_NAME } from '$lib/config';
	import ProjectModal from '$lib/components/ProjectModal.svelte';

	let statusData: any[] = [];
	let phases: any[] = [];
	let dailyStats: any = {};
	let loading = true;
	let error: string | null = null;
	let selectedDateRange = {
		start: '',
		end: ''
	};
	let showProjectModal = false;

	onMount(async () => {
		await fetchData();
	});

	async function fetchData() {
	loading = true;
	error = null;

	try {
		// Construir URL com parâmetros de data
		let dateParams = '';
		if (selectedDateRange.start || selectedDateRange.end) {
			dateParams = `startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`;
		}
		
		const statusResp = await fetchAPI<any[]>(`/status?${dateParams}`);
		statusData = Array.isArray(statusResp) ? statusResp : [];

		const phasesResp = await fetchAPI<any[]>(`/status/phases?${dateParams}`);
		phases = Array.isArray(phasesResp) ? phasesResp : [];

		const dailyStatsResp = await fetchAPI<any>(`/daily-updates/stats?${dateParams}`);
		dailyStats = dailyStatsResp && typeof dailyStatsResp === 'object' ? dailyStatsResp : {};
	} catch (err: any) {
		error = err.message || 'Erro desconhecido ao buscar dados.';
		console.error('Failed to fetch data:', err);
	} finally {
		loading = false;
	}
}


function openProjectModal() {
	showProjectModal = true;
}

function handleProjectCreated() {
	fetchData();
}

function clearFilters() {
	selectedDateRange = {
		start: '',
		end: ''
	};
	fetchData();
}

	function getStatusColor(status: string) {
		switch (status?.toLowerCase?.()) {
			case 'completed': return 'status-completed';
			case 'in_progress': case 'in-progress': return 'status-in-progress';
			case 'not_started': case 'not-started': return 'status-not-started';
			case 'on_hold': case 'on-hold': return 'status-on-hold';
			default: return 'status-not-started';
		}
	}

	function formatStatus(status: string) {
		if (!status) return '';
		const translations: Record<string, string> = {
			'completed': 'Concluído',
			'in_progress': 'Em Progresso',
			'in-progress': 'Em Progresso',
			'not_started': 'Não Iniciado',
			'not-started': 'Não Iniciado',
			'on_hold': 'Em Espera',
			'on-hold': 'Em Espera',
			'todo': 'A Fazer',
			'review': 'Revisão',
			'blocked': 'Bloqueado',
			'planning': 'Planejamento',
			'cancelled': 'Cancelado'
		};
		const key = status.toLowerCase();
		return translations[key] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	}
</script>

	<svelte:head>
		<title>{BRAND_NAME} - Dashboard de Construção</title>
	</svelte:head>

<div class="app-container">
	<!-- Sidebar Navigation -->
	<nav class="sidebar">
		<div style="padding: 2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
			<h2 style="margin: 0; color: white; font-size: 1.5rem;">🏗️ {BRAND_NAME}</h2>
			<p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem;">Gestão de Construção</p>
		</div>
		
		<div style="padding: 1rem 0;">
			<a href="/" class="nav-item active">
				<Activity size={20} style="display: inline; margin-right: 0.75rem;" />
				Painel de Status
			</a>
			<a href="/labor" class="nav-item">
				<Users size={20} style="display: inline; margin-right: 0.75rem;" />
				Gestão de Mão de Obra
			</a>
			<a href="/materials" class="nav-item">
				<Package size={20} style="display: inline; margin-right: 0.75rem;" />
				Materiais e P&M
			</a>
			<a href="/daily-updates" class="nav-item">
				<Calendar size={20} style="display: inline; margin-right: 0.75rem;" />
				Atualizações Diárias
			</a>
			<a href="/reports" class="nav-item">
				<TrendingUp size={20} style="display: inline; margin-right: 0.75rem;" />
				Relatórios
			</a>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="main-content">
		<!-- Header -->
		<div class="header">
			<h1>Dashboard de Status da Construção</h1>
			<p class="subtitle">Visão geral em tempo real de todas as atividades • {new Date().toLocaleDateString('pt-BR')}</p>
		</div>

		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Carregando dados...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<h3>⚠️ Erro ao Carregar Dados</h3>
				<p>{error}</p>
				<button on:click={fetchData} class="btn-retry">Tentar Novamente</button>
			</div>
		{:else}
			<!-- Dashboard Statistics -->
			<div class="dashboard-grid">
				<div class="stat-card">
					<div class="stat-number">{statusData.length}</div>
					<div class="stat-label">Projetos Ativos</div>
				</div>
				<div class="stat-card">
					<div class="stat-number">{phases.filter(p => p.status === 'IN_PROGRESS').length}</div>
					<div class="stat-label">Fases em Progresso</div>
				</div>
				<div class="stat-card">
					<div class="stat-number">{Math.round(dailyStats.avg_manpower || 0)}</div>
					<div class="stat-label">Média de Manpower</div>
				</div>
				<div class="stat-card">
					<div class="stat-number">{dailyStats.total_safety_incidents || 0}</div>
					<div class="stat-label">Incidentes de Segurança</div>
				</div>
			</div>

			<!-- Date Range Control -->
			<div class="card">
				<div class="card-header">
					<h3 class="card-title">📅 Filtro de Período</h3>
				</div>
				<div style="display: flex; gap: 1rem; align-items: end;">
				<div class="form-group" style="margin-bottom: 0;">
					<label class="form-label" for="start-date">Data Inicial</label>
					<input id="start-date" type="date" class="form-input" bind:value={selectedDateRange.start} />
				</div>
				<div class="form-group" style="margin-bottom: 0;">
					<label class="form-label" for="end-date">Data Final</label>
					<input id="end-date" type="date" class="form-input" bind:value={selectedDateRange.end} />
				</div>
				<div style="display: flex; gap: 0.5rem;">
					<button class="btn btn-primary" on:click={fetchData}>Atualizar</button>
					{#if selectedDateRange.start || selectedDateRange.end}
						<button class="btn btn-secondary" on:click={clearFilters}>Limpar</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Project Status Overview -->
		<div class="card">
			<div class="card-header">
					<h3 class="card-title">🏢 Painel de Status de Projetos</h3>
					<button class="btn btn-secondary" on:click={openProjectModal}>Adicionar Novo Projeto</button>
				</div>
			<div class="table-container">
				<table class="table">
					<thead>
						<tr>
							<th>Nome do Projeto</th>
							<th>Fase</th>
							<th>Status</th>
							<th>Progresso</th>
							<th>Data de Início</th>
							<th>Data Prevista</th>
						</tr>
					</thead>
					<tbody>
						{#each statusData as project}
							<tr>
								<td style="font-weight: 600;">{project.projectName}</td>
								<td>{project.phase}</td>
								<td>
									<span class="status-badge {getStatusColor(project.status)}">
										{formatStatus(project.status)}
									</span>
								</td>
								<td>
									<div class="progress-bar">
										<div class="progress-fill" style="width: {project.progress}%"></div>
									</div>
									<small>{project.progress}%</small>
								</td>
								<td>{project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'Não definido'}</td>
								<td>{project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'Não definido'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Construction Phases -->
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">🔧 Status das Fases de Construção</h3>
			</div>
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
				{#each phases as phase}
					<div class="card" style="margin-bottom: 0; border-left: 4px solid var(--primary-gold);">
						<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
							<div>
								<h4 style="margin: 0; color: var(--text-dark);">{phase.phase}</h4>
								<p style="margin: 0.25rem 0; color: var(--text-light); font-size: 0.9rem;">{phase.projectName}</p>
							</div>
							<span class="status-badge {getStatusColor(phase.status)}">
								{formatStatus(phase.status)}
							</span>
						</div>
						<div class="progress-bar">
							<div class="progress-fill" style="width: {phase.progress}%"></div>
						</div>
						<div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light);">
							<span>{phase.progress}%</span>
							<span>{phase.projectName}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">⚡ Ações Rápidas</h3>
			</div>
			<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
				<button class="btn btn-primary">📝 Diário de Obra</button>
				<button class="btn btn-secondary">👷 Gestão de Mão de Obra</button>
				<button class="btn btn-secondary">📦 Pedido de Material</button>
				<button class="btn btn-secondary">🚨 Reportar Incidente</button>
				<button class="btn btn-secondary">📊 Gerar Relatório</button>
			</div>
		</div>

			{/if}
	
	<!-- Project Modal -->
	<ProjectModal 
		bind:isOpen={showProjectModal}
		on:success={handleProjectCreated}
	/>
	</main>
</div>

<style>
	.table-container {
		overflow-x: auto;
	}

	.nav-item {
		display: flex;
		align-items: center;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		color: var(--text-light);
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-state {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		margin: 2rem 0;
	}

	.error-state h3 {
		color: #c33;
		margin: 0 0 1rem 0;
	}

	.error-state p {
		color: #666;
		margin: 0 0 1.5rem 0;
	}

	.btn-retry {
		background: var(--primary);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		transition: background 0.2s;
	}

	.btn-retry:hover {
		background: var(--primary-dark);
	}
</style>
