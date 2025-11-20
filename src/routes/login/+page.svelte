<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_BASE } from '$lib/config.js';
	import { Building, Lock, Mail } from 'lucide-svelte';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleLogin() {
		error = '';
		loading = true;

		try {
			const response = await fetch(`${API_BASE}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));

			goto('/dashboard');
		} catch (err: any) {
			error = err.message || 'An error occurred during login';
		} finally {
			loading = false;
		}
	}

	function fillCredentials(role: string) {
		switch (role) {
			case 'admin':
				email = 'admin@nationalgroup.com';
				password = 'admin123';
				break;
			case 'manager':
				email = 'manager@nationalgroup.com';
				password = 'manager123';
				break;
			case 'supervisor':
				email = 'supervisor@nationalgroup.com';
				password = 'supervisor123';
				break;
			case 'worker':
				email = 'worker1@nationalgroup.com';
				password = 'worker123';
				break;
		}
	}
</script>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<Building size={48} class="logo-icon" />
			<h1>National Group India</h1>
			<p>Construction Management System</p>
		</div>

		<form on:submit|preventDefault={handleLogin} class="login-form">
			{#if error}
				<div class="error-message">
					{error}
				</div>
			{/if}

			<div class="form-group">
				<label for="email">
					<Mail size={20} />
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="your.email@nationalgroup.com"
					required
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="password">
					<Lock size={20} />
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Enter your password"
					required
					disabled={loading}
				/>
			</div>

			<button type="submit" class="login-button" disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>

		<div class="demo-credentials">
			<p class="demo-title">Demo Credentials:</p>
			<div class="demo-buttons">
				<button on:click={() => fillCredentials('admin')} class="demo-btn admin">
					Admin
				</button>
				<button on:click={() => fillCredentials('manager')} class="demo-btn manager">
					Manager
				</button>
				<button on:click={() => fillCredentials('supervisor')} class="demo-btn supervisor">
					Supervisor
				</button>
				<button on:click={() => fillCredentials('worker')} class="demo-btn worker">
					Worker
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px;
	}

	.login-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		padding: 40px;
		width: 100%;
		max-width: 450px;
	}

	.login-header {
		text-align: center;
		margin-bottom: 32px;
	}

	.login-header :global(.logo-icon) {
		color: #667eea;
		margin-bottom: 16px;
	}

	.login-header h1 {
		font-size: 28px;
		font-weight: 700;
		color: #1a202c;
		margin: 0 0 8px 0;
	}

	.login-header p {
		color: #718096;
		font-size: 14px;
		margin: 0;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 12px;
		border-radius: 8px;
		font-size: 14px;
		border: 1px solid #fcc;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-group label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: #2d3748;
		font-size: 14px;
	}

	.form-group input {
		padding: 12px 16px;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		font-size: 16px;
		transition: all 0.2s;
	}

	.form-group input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.form-group input:disabled {
		background: #f7fafc;
		cursor: not-allowed;
	}

	.login-button {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 14px;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		margin-top: 8px;
	}

	.login-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
	}

	.login-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.demo-credentials {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid #e2e8f0;
	}

	.demo-title {
		text-align: center;
		color: #718096;
		font-size: 14px;
		margin: 0 0 16px 0;
		font-weight: 600;
	}

	.demo-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.demo-btn {
		padding: 10px;
		border: 2px solid;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		background: white;
	}

	.demo-btn.admin {
		border-color: #e53e3e;
		color: #e53e3e;
	}

	.demo-btn.admin:hover {
		background: #e53e3e;
		color: white;
	}

	.demo-btn.manager {
		border-color: #3182ce;
		color: #3182ce;
	}

	.demo-btn.manager:hover {
		background: #3182ce;
		color: white;
	}

	.demo-btn.supervisor {
		border-color: #38a169;
		color: #38a169;
	}

	.demo-btn.supervisor:hover {
		background: #38a169;
		color: white;
	}

	.demo-btn.worker {
		border-color: #d69e2e;
		color: #d69e2e;
	}

	.demo-btn.worker:hover {
		background: #d69e2e;
		color: white;
	}

	@media (max-width: 480px) {
		.login-card {
			padding: 24px;
		}

		.login-header h1 {
			font-size: 24px;
		}

		.demo-buttons {
			grid-template-columns: 1fr;
		}
	}
</style>
