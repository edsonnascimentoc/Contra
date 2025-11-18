<script lang="ts">
	import { onMount } from 'svelte';
	import { Users, Plus, Edit, Trash2, Search } from 'lucide-svelte';
	import { API_BASE } from '$lib/config.js';
	
	let laborData: any[] = [];
	let filteredData: any[] = [];
	let showForm = false;
	let editingId: number | null = null;
	let searchTerm = '';
	let filterType = 'ALL';
	let formData = {
		name: '',
		designation: '',
		department: '',
		contact: '',
		daily_rate: 0,
		type: 'STAFF',
		status: 'ACTIVE'
	};
	
	onMount(async () => {
		await fetchLabor();
	});
	
	async function fetchLabor() {
		try {
			const response = await fetch(`${API_BASE}/labor`);
			laborData = await response.json();
			applyFilters();
		} catch (error) {
			console.error('Erro ao buscar dados de mão de obra:', error);
		}
	}
	
	function applyFilters() {
		filteredData = laborData.filter(labor => {
			const matchesSearch = !searchTerm || 
				labor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(labor.designation && labor.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(labor.department && labor.department.toLowerCase().includes(searchTerm.toLowerCase()));
			
			const matchesType = filterType === 'ALL' || labor.type === filterType;
			
			return matchesSearch && matchesType;
		});
	}
	
	$: {
		searchTerm;
		filterType;
		applyFilters();
	}
	
	function openForm(labor: any = null) {
		if (labor) {
			editingId = labor.id;
			formData = {
				...labor,
				contact: formatPhoneDisplay(labor.contact)
			};
		} else {
			editingId = null;
			formData = {
				name: '',
				designation: '',
				department: '',
				contact: '',
				daily_rate: 0,
				type: 'STAFF',
				status: 'ACTIVE'
			};
		}
		showForm = true;
	}

	function closeForm() {
		showForm = false;
		editingId = null;
	}
	
	function formatPhone(value: string): string {
		return value.replace(/\D/g, '');
	}

	function formatPhoneDisplay(value: string): string {
		if (!value) return '';
		const numbers = value.replace(/\D/g, '');

		if (numbers.length <= 10) {
			return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, ddd, first, second) => {
				if (second) return `(${ddd})${first}-${second}`;
				if (first) return `(${ddd})${first}`;
				return `(${ddd}`;
			});
		} else {
			return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, ddd, first, second) => {
				if (second) return `(${ddd})${first}-${second}`;
				if (first) return `(${ddd})${first}`;
				return `(${ddd}`;
			});
		}
	}

	function handlePhoneInput(event: any) {
		const input = event.target;
		const formatted = formatPhoneDisplay(input.value);
		input.value = formatted;
		formData.contact = formatPhone(input.value);
	}

	async function saveLabor() {
		if (!formData.name || !formData.designation || !formData.department || !formData.contact || !formData.daily_rate || !formData.type) {
			alert('Por favor, preencha todos os campos obrigatórios');
			return;
		}

		const phoneNumbers = formData.contact.replace(/\D/g, '');
		if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
			alert('Número de telefone inválido. Use o formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX');
			return;
		}

		try {
			const url = editingId
				? `${API_BASE}/labor/${editingId}`
				: `${API_BASE}/labor`;

			const method = editingId ? 'PUT' : 'POST';

			const dataToSave = {
				...formData,
				contact: phoneNumbers
			};

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(dataToSave)
			});

			if (response.ok) {
				await fetchLabor();
				closeForm();
				alert(editingId ? 'Registro atualizado com sucesso!' : 'Registro criado com sucesso!');
			} else {
				const errorData = await response.json().catch(() => ({}));
				alert(errorData.error || 'Erro ao salvar registro');
			}
		} catch (error) {
			console.error('Erro ao salvar mão de obra:', error);
			alert('Erro ao conectar com o servidor. Verifique sua conexão.');
		}
	}

	async function deleteLabor(id: number, name: string) {
		if (!confirm(`Tem certeza que deseja excluir o registro de "${name}"?\n\nEsta ação não pode ser desfeita.`)) return;

		try {
			const response = await fetch(`${API_BASE}/labor/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await fetchLabor();
				alert('Registro excluído com sucesso!');
			} else {
				const errorData = await response.json().catch(() => ({}));
				if (response.status === 404) {
					alert('Registro não encontrado. Pode ter sido excluído anteriormente.');
				} else if (response.status === 403) {
					alert('Você não tem permissão para excluir este registro.');
				} else {
					alert(errorData.error || 'Erro ao excluir registro');
				}
			}
		} catch (error) {
			console.error('Erro ao excluir mão de obra:', error);
			alert('Erro ao conectar com o servidor. Verifique sua conexão.');
		}
	}
	
	function getTypeLabel(type: string) {
		const types: any = {
			'STAFF': 'Funcionário',
			'NMT': 'NMT',
			'CONTRACT': 'Contratado'
		};
		return types[type] || type;
	}
	
	function getTypeBadgeClass(type: string) {
		const classes: any = {
			'STAFF': 'badge-staff',
			'NMT': 'badge-nmt',
			'CONTRACT': 'badge-contract'
		};
		return classes[type] || 'badge-staff';
	}
</script>

<svelte:head>
	<title>Gerenciamento de Mão de Obra - National Group India</title>
</svelte:head>
<div class="app-container">
	<nav class="sidebar">
		<div style="padding: 2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
			<h2 style="margin: 0; color: white; font-size: 1.5rem;">🏗️ National Group</h2>
			<p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem;">Gestão de Construção</p>
		</div>
		
		<div style="padding: 1rem 0;">
			<a href="/" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📊</span>
				Painel de Status
			</a>
			<a href="/labor" class="nav-item active">
				<Users size={20} style="display: inline; margin-right: 0.75rem;" />
				Gerenciamento de Mão de Obra
			</a>
			<a href="/materials" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📦</span>
				Materiais & P&M
			</a>
			<a href="/daily-updates" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📅</span>
				Atualizações Diárias
			</a>
			<a href="/reports" class="nav-item">
				<span style="display: inline; margin-right: 0.75rem;">📈</span>
				Relatórios
			</a>
		</div>
	</nav>

	<main class="main-content">
		<div class="header">
			<div>
				<h1>Gerenciamento de Mão de Obra</h1>
				<p class="subtitle">Controle de Funcionários, NMT e Contratados</p>
			</div>
			<button class="btn-primary" on:click={() => openForm()}>
				<Plus size={20} style="margin-right: 0.5rem;" />
				Adicionar Trabalhador
			</button>
		</div>

		<div class="filters-card">
			<div class="search-box">
				<Search size={20} style="color: #6b7280;" />
				<input 
					type="text" 
					placeholder="Buscar por nome, cargo ou departamento..." 
					bind:value={searchTerm}
				/>
			</div>
			
			<div class="filter-buttons">
				<button 
					class="filter-btn {filterType === 'ALL' ? 'active' : ''}"
					on:click={() => filterType = 'ALL'}
				>
					Todos ({laborData.length})
				</button>
				<button 
					class="filter-btn {filterType === 'STAFF' ? 'active' : ''}"
					on:click={() => filterType = 'STAFF'}
				>
					Funcionários ({laborData.filter(l => l.type === 'STAFF').length})
				</button>
				<button 
					class="filter-btn {filterType === 'NMT' ? 'active' : ''}"
					on:click={() => filterType = 'NMT'}
				>
					NMT ({laborData.filter(l => l.type === 'NMT').length})
				</button>
				<button 
					class="filter-btn {filterType === 'CONTRACT' ? 'active' : ''}"
					on:click={() => filterType = 'CONTRACT'}
				>
					Contratados ({laborData.filter(l => l.type === 'CONTRACT').length})
				</button>
			</div>
		</div>

		<div class="card">
			<div class="table-container">
				<table class="data-table">
					<thead>
						<tr>
							<th style="width: 20%;">Nome</th>
							<th style="width: 15%;">Cargo</th>
							<th style="width: 15%;">Departamento</th>
							<th style="width: 13%;">Contato</th>
							<th style="width: 12%;">Taxa Diária</th>
							<th style="width: 10%;">Tipo</th>
							<th style="width: 8%;">Status</th>
							<th style="width: 7%;">Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredData as labor}
							<tr>
								<td>
									<div class="name-cell">
										<strong>{labor.name}</strong>
									</div>
								</td>
								<td>{labor.designation || '-'}</td>
								<td>{labor.department || '-'}</td>
								<td>{formatPhoneDisplay(labor.contact) || '-'}</td>
								<td>R$ {labor.daily_rate?.toFixed(2) || '0,00'}</td>
								<td>
									<span class="badge {getTypeBadgeClass(labor.type)}">
										{getTypeLabel(labor.type)}
									</span>
								</td>
								<td>
									<span class="badge {labor.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">
										{labor.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
									</span>
								</td>
								<td>
									<div class="action-buttons">
										<button class="btn-icon" on:click={() => openForm(labor)} title="Editar">
											<Edit size={16} />
										</button>
										<button class="btn-icon btn-danger" on:click={() => deleteLabor(labor.id, labor.name)} title="Excluir">
											<Trash2 size={16} />
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="8" style="text-align: center; padding: 2rem;">
									{searchTerm || filterType !== 'ALL' 
										? 'Nenhum resultado encontrado' 
										: 'Nenhum trabalhador cadastrado'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>
{#if showForm}
	<div class="modal-overlay" on:click={closeForm}>
		<div class="modal-content" on:click|stopPropagation>
			<h2>{editingId ? 'Editar' : 'Adicionar'} Trabalhador</h2>
			
			<form on:submit|preventDefault={saveLabor}>
				<div class="form-group">
					<label for="name">Nome Completo *</label>
					<input type="text" id="name" bind:value={formData.name} required placeholder="Digite o nome completo" />
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="designation">Cargo</label>
						<input type="text" id="designation" bind:value={formData.designation} placeholder="Ex: Engenheiro Civil" />
					</div>
					
					<div class="form-group">
						<label for="department">Departamento</label>
						<input type="text" id="department" bind:value={formData.department} placeholder="Ex: Engenharia" />
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="contact">Telefone de Contato *</label>
						<input
							type="text"
							id="contact"
							value={formData.contact}
							on:input={handlePhoneInput}
							placeholder="(13)98899-9906"
							maxlength="14"
							required
						/>
						<small class="form-hint">Formato: (XX)XXXXX-XXXX ou (XX)XXXX-XXXX</small>
					</div>
					
					<div class="form-group">
						<label for="daily_rate">Taxa Diária (R$)</label>
						<input 
							type="number" 
							id="daily_rate" 
							bind:value={formData.daily_rate} 
							step="0.01" 
							min="0"
							placeholder="0,00"
						/>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="type">Tipo de Trabalhador *</label>
						<select id="type" bind:value={formData.type} required>
							<option value="STAFF">Funcionário</option>
							<option value="NMT">NMT</option>
							<option value="CONTRACT">Contratado</option>
						</select>
					</div>
					
					<div class="form-group">
						<label for="status">Status *</label>
						<select id="status" bind:value={formData.status} required>
							<option value="ACTIVE">Ativo</option>
							<option value="INACTIVE">Inativo</option>
						</select>
					</div>
				</div>
				
				<div class="form-actions">
					<button type="button" class="btn-secondary" on:click={closeForm}>
						Cancelar
					</button>
					<button type="submit" class="btn-primary">
						{editingId ? 'Atualizar' : 'Salvar'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		color: white;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
	}

	.subtitle {
		margin: 0.5rem 0 0 0;
		opacity: 0.9;
	}

	.filters-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.search-box input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 1rem;
		outline: none;
	}

	.filter-buttons {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.filter-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		background: white;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.filter-btn:hover {
		background: #f9fafb;
		border-color: #667eea;
	}

	.filter-btn.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.table-container {
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		min-width: 900px;
	}

	.data-table th {
		text-align: left;
		padding: 1rem;
		border-bottom: 2px solid #e5e7eb;
		font-weight: 600;
		color: #374151;
		background: #f9fafb;
	}

	.data-table td {
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.data-table tbody tr:hover {
		background: #f9fafb;
	}

	.name-cell {
		word-break: break-word;
		overflow-wrap: break-word;
		max-width: 200px;
	}

	.badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.badge-staff {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-nmt {
		background: #fef3c7;
		color: #92400e;
	}

	.badge-contract {
		background: #e0e7ff;
		color: #4338ca;
	}

	.badge-active {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-inactive {
		background: #fee2e2;
		color: #991b1b;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.btn-icon {
		padding: 0.5rem;
		border: none;
		background: #f3f4f6;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-icon:hover {
		background: #e5e7eb;
	}

	.btn-icon.btn-danger:hover {
		background: #fee2e2;
		color: #dc2626;
	}

	.btn-primary {
		display: flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: white;
		color: #667eea;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		white-space: nowrap;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.btn-secondary {
		padding: 0.75rem 1.5rem;
		background: #f3f4f6;
		color: #374151;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		max-width: 600px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-content h2 {
		margin: 0 0 1.5rem 0;
		color: #111827;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	/* Layout de duas colunas para campos lado a lado */
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr; /* Duas colunas de tamanho igual */
		gap: 1rem; /* Espaçamento entre os campos */
		align-items: start; /* Alinha os campos no topo */
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #374151;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.form-hint {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}

	/* Responsividade para tablets (768px - 1024px) */
	@media (max-width: 1024px) and (min-width: 769px) {
		.form-row {
			gap: 0.75rem; /* Reduz espaçamento em tablets */
		}
	}

	/* Responsividade para mobile (até 768px) */
	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			position: relative;
			height: auto;
		}

		.main-content {
			margin-left: 0;
		}

		.header {
			flex-direction: column;
			align-items: flex-start;
		}

		/* Em mobile, campos ficam empilhados verticalmente */
		.form-row {
			grid-template-columns: 1fr; /* Uma coluna em mobile */
			gap: 1rem;
		}

		.filter-buttons {
			flex-direction: column;
		}

		.filter-btn {
			width: 100%;
		}
	}
</style>
