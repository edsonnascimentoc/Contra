<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fetchAPI } from '$lib/api';

	export let isOpen = false;
	export let editingProject: any = null;

	const dispatch = createEventDispatcher();

	let formData = {
		projectName: '',
		phase: 'Construção',
		status: 'PLANNING',
		progress: 0,
		startDate: '',
		endDate: ''
	};

	$: if (editingProject && isOpen) {
		formData = {
			projectName: editingProject.projectName,
			phase: editingProject.phase,
			status: editingProject.status,
			progress: editingProject.progress || 0,
			startDate: editingProject.startDate ? new Date(editingProject.startDate).toISOString().split('T')[0] : '',
			endDate: editingProject.endDate ? new Date(editingProject.endDate).toISOString().split('T')[0] : ''
		};
	} else if (!editingProject && isOpen) {
		resetForm();
	}

	let loading = false;
	let error: string | null = null;

	const phases = [
		'Construção',
		'Elétrica',
		'Mecânica',
		'Consumíveis',
		'Segurança',
		'QA & QC'
	];

	const statuses = [
		{ value: 'PLANNING', label: 'Planejamento' },
		{ value: 'IN_PROGRESS', label: 'Em Progresso' },
		{ value: 'ON_HOLD', label: 'Em Espera' },
		{ value: 'COMPLETED', label: 'Concluído' }
	];

	function resetForm() {
		formData = {
			projectName: '',
			phase: 'Construção',
			status: 'PLANNING',
			progress: 0,
			startDate: '',
			endDate: ''
		};
		error = null;
	}

	function closeModal() {
		isOpen = false;
		resetForm();
		dispatch('close');
	}

	// T6 — Função segura de parse — usar em todo bind de data
	function parseInputDate(value: string) {
		if (!value) return null;
		// Força interpretação local evitando UTC offset que desloca o dia
		const d = new Date(value + 'T00:00:00');
		if (isNaN(d.getTime()) || d.getFullYear() < 2000) return null;
		return d;
	}

	// T6 — Validação antes do submit
	function validateDates() {
		const start = parseInputDate(formData.startDate);
		const end = parseInputDate(formData.endDate);

		if (!start) return 'Data de início inválida ou com ano incorreto (deve ser > 2000)';
		if (!end) return 'Data de término inválida ou com ano incorreto (deve ser > 2000)';
		if (end <= start) return 'A data de término deve ser posterior à data de início';
		return null;
	}

	async function handleSubmit() {
		console.log('Submitting form data:', formData);
		if (!formData.projectName.trim() || !formData.phase) {
			error = 'Nome do projeto e fase são obrigatórios';
			return;
		}

		// Validar datas robustamente
		const dateError = validateDates();
		if (dateError) {
			error = dateError;
			return;
		}

		loading = true;
		error = null;

		try {
			const payload = {
				projectName: formData.projectName,
				phase: formData.phase,
				status: formData.status,
				progress: formData.progress,
				startDate: formData.startDate || null,
				endDate: formData.endDate || null
			};

			const url = editingProject ? `/status/${editingProject.id}` : '/status';
			const method = editingProject ? 'PUT' : 'POST';

			console.log(`🚀 Sending ${method} request to ${url}`);
			const result = await fetchAPI(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			console.log('✅ Server response:', result);

			dispatch('success');
			closeModal();
		} catch (err: any) {
			error = err.message || 'Falha ao salvar projeto';
			console.error('Error saving project:', err);
		} finally {
			loading = false;
		}
	}



	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={(e) => isOpen && handleKeydown(e)} />

{#if isOpen}
	<div
	class="modal-container"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	{...isOpen ? {} : { 'aria-hidden': true, 'tabindex': -1 }}
>
	<button
		class="modal-overlay"
		on:click={closeModal}
		aria-label="Close modal"
	></button>

	<div class="modal-content" role="document">
		<div class="modal-header">
			<h3 id="modal-title">{editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</h3>
			<button class="close-btn" on:click={closeModal} aria-label="Fechar modal">
				&times;
			</button>
		</div>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<label class="form-label" for="project-name">Nome do Projeto *</label>
				<input
					id="project-name"
					type="text"
					class="form-input"
					bind:value={formData.projectName}
					placeholder="Digite o nome do projeto"
					required
				/>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label class="form-label" for="phase">Fase</label>
					<select id="phase" class="form-select" bind:value={formData.phase}>
						{#each phases as phase}
							<option value={phase}>{phase}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label class="form-label" for="status">Status</label>
					<select id="status" class="form-select" bind:value={formData.status}>
						{#each statuses as status}
							<option value={status.value}>{status.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="form-group">
				<label class="form-label" for="progress">Progresso (%)</label>
				<input
					id="progress"
					type="range"
					min="0"
					max="100"
					class="form-range"
					bind:value={formData.progress}
				/>
				<div class="progress-value">{formData.progress}%</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label class="form-label" for="start-date">Data de Início *</label>
					<input
						id="start-date"
						type="date"
						class="form-input"
						bind:value={formData.startDate}
						required
					/>
				</div>

				<div class="form-group">
					<label class="form-label" for="end-date">Data de Término *</label>
					<input
						id="end-date"
						type="date"
						class="form-input"
						bind:value={formData.endDate}
						required
					/>
				</div>
			</div>


			{#if error}
				<div class="error-message">{error}</div>
			{/if}

			<div class="modal-actions">
				<button type="button" class="btn btn-secondary" on:click={closeModal}>
					Cancelar
				</button>
				<button type="submit" class="btn btn-primary" disabled={loading}>
					{loading ? 'Salvando...' : (editingProject ? 'Salvar Alterações' : 'Criar Projeto')}
				</button>
			</div>
		</form>
	</div>
</div>
{/if}


<style>
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}

	button.modal-overlay {
		all: unset;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		cursor: pointer;
		display: block;
		width: 100%;
		height: 100%;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		max-width: 500px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		position: relative;
		z-index: 1001;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h3 {
		margin: 0;
		color: #1f2937;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #6b7280;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background-color: #f3f4f6;
		color: #374151;
	}

	form {
		padding: 1.5rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.form-input,
	.form-select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.form-input:focus,
	.form-select:focus {
		outline: none;
		border-color: #d4af37;
		box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
	}

	.form-range {
		width: 100%;
		margin: 0.5rem 0;
	}

	.progress-value {
		text-align: center;
		font-weight: 500;
		color: #6b7280;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.error-message {
		background-color: #fee;
		border: 1px solid #fcc;
		border-radius: 6px;
		padding: 0.75rem;
		color: #c33;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background-color: #d4af37;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #b8860b;
	}

	.btn-secondary {
		background-color: #f3f4f6;
		color: #374151;
		border: 1px solid #d1d5db;
	}

	.btn-secondary:hover {
		background-color: #e5e7eb;
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}
		
		.modal-actions {
			flex-direction: column;
		}
		
		.btn {
			width: 100%;
		}
	}
</style>