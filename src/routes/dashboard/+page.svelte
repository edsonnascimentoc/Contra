<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_BASE } from '$lib/config.js';
	import { 
		Building, 
		Users, 
		CheckSquare, 
		Activity, 
		LogOut,
		FolderKanban,
		ListTodo,
		MessageSquare
	} from 'lucide-svelte';

	let user: any = null;
	let stats = {
		projects: 0,
		tasks: 0,
		users: 0,
		completedTasks: 0
	};
	let recentProjects: any[] = [];
	let recentTasks: any[] = [];
	let loading = true;

	onMount(async () => {
		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		if (!token || !userData) {
			goto('/login');
			return;
		}

		user = JSON.parse(userData);
		await fetchDashboardData(token);
	});

	async function fetchDashboardData(token: string) {
		try {
			const headers = {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			};

			const [projectsRes, tasksRes, usersRes] = await Promise.all([
				fetch(`${API_BASE}/projects`, { headers }),
				fetch(`${API_BASE}/tasks`, { headers }),
				fetch(`${API_BASE}/users`, { headers })
			]);

			const projects = await projectsRes.json();
			const tasks = await tasksRes.json();
			const users = await usersRes.json();

			stats.projects = projects.length;
			stats.tasks = tasks.length;
			stats.users = users.length;
			stats.completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;

			recentProjects = projects.slice(0, 5);
			recentTasks = tasks.slice(0, 5);
		} catch (error) {
			console.error('Failed to fetch dashboard data:', error);
		} finally {
			loading = false;
		}
	}

	function handleLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		goto('/login');
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'COMPLETED': return 'bg-green-100 text-green-800';
			case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
			case 'TODO': return 'bg-gray-100 text-gray-800';
			case 'PLANNING': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'URGENT': return 'bg-red-100 text-red-800';
			case 'HIGH': return 'bg-orange-100 text-orange-800';
			case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
			case 'LOW': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="dashboard">
	<header class="dashboard-header">
		<div class="header-content">
			<div class="header-left">
				<Building size={32} />
				<div>
					<h1>National Group India</h1>
					<p>Construction Management System</p>
				</div>
			</div>
			<div class="header-right">
				<div class="user-info">
					<span class="user-name">{user?.firstName} {user?.lastName}</span>
					<span class="user-role">{user?.role}</span>
				</div>
				<button on:click={handleLogout} class="logout-btn">
					<LogOut size={20} />
					Logout
				</button>
			</div>
		</div>
	</header>

	<main class="dashboard-main">
		{#if loading}
			<div class="loading">Loading dashboard...</div>
		{:else}
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-icon projects">
						<FolderKanban size={24} />
					</div>
					<div class="stat-content">
						<h3>{stats.projects}</h3>
						<p>Total Projects</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon tasks">
						<ListTodo size={24} />
					</div>
					<div class="stat-content">
						<h3>{stats.tasks}</h3>
						<p>Total Tasks</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon completed">
						<CheckSquare size={24} />
					</div>
					<div class="stat-content">
						<h3>{stats.completedTasks}</h3>
						<p>Completed Tasks</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon users">
						<Users size={24} />
					</div>
					<div class="stat-content">
						<h3>{stats.users}</h3>
						<p>Team Members</p>
					</div>
				</div>
			</div>

			<div class="content-grid">
				<div class="content-card">
					<h2>Recent Projects</h2>
					<div class="list">
						{#each recentProjects as project}
							<div class="list-item">
								<div class="item-info">
									<h4>{project.name}</h4>
									<p>{project.location || 'No location'}</p>
								</div>
								<span class="badge {getStatusColor(project.status)}">
									{project.status}
								</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="content-card">
					<h2>Recent Tasks</h2>
					<div class="list">
						{#each recentTasks as task}
							<div class="list-item">
								<div class="item-info">
									<h4>{task.title}</h4>
									<p>{task.description || 'No description'}</p>
								</div>
								<div class="badges">
									<span class="badge {getStatusColor(task.status)}">
										{task.status}
									</span>
									<span class="badge {getPriorityColor(task.priority)}">
										{task.priority}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.dashboard {
		min-height: 100vh;
		background: #f7fafc;
	}

	.dashboard-header {
		background: white;
		border-bottom: 1px solid #e2e8f0;
		padding: 16px 24px;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.header-left :global(svg) {
		color: #667eea;
	}

	.header-left h1 {
		font-size: 20px;
		font-weight: 700;
		color: #1a202c;
		margin: 0;
	}

	.header-left p {
		font-size: 14px;
		color: #718096;
		margin: 0;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.user-name {
		font-weight: 600;
		color: #2d3748;
	}

	.user-role {
		font-size: 12px;
		color: #718096;
		text-transform: uppercase;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: #e53e3e;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.logout-btn:hover {
		background: #c53030;
	}

	.dashboard-main {
		max-width: 1400px;
		margin: 0 auto;
		padding: 24px;
	}

	.loading {
		text-align: center;
		padding: 48px;
		color: #718096;
		font-size: 18px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 32px;
	}

	.stat-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		display: flex;
		align-items: center;
		gap: 16px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.stat-icon {
		width: 56px;
		height: 56px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.stat-icon.projects {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.stat-icon.tasks {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	}

	.stat-icon.completed {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	}

	.stat-icon.users {
		background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
	}

	.stat-content h3 {
		font-size: 32px;
		font-weight: 700;
		color: #1a202c;
		margin: 0;
	}

	.stat-content p {
		font-size: 14px;
		color: #718096;
		margin: 4px 0 0 0;
	}

	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: 24px;
	}

	.content-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.content-card h2 {
		font-size: 18px;
		font-weight: 700;
		color: #1a202c;
		margin: 0 0 20px 0;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.list-item {
		padding: 16px;
		background: #f7fafc;
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}

	.item-info {
		flex: 1;
		min-width: 0;
	}

	.item-info h4 {
		font-size: 14px;
		font-weight: 600;
		color: #2d3748;
		margin: 0 0 4px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-info p {
		font-size: 12px;
		color: #718096;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.badges {
		display: flex;
		gap: 8px;
	}

	.badge {
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 600;
		white-space: nowrap;
	}

	.bg-green-100 { background: #c6f6d5; }
	.text-green-800 { color: #22543d; }
	.bg-blue-100 { background: #bee3f8; }
	.text-blue-800 { color: #2c5282; }
	.bg-gray-100 { background: #edf2f7; }
	.text-gray-800 { color: #2d3748; }
	.bg-yellow-100 { background: #fefcbf; }
	.text-yellow-800 { color: #744210; }
	.bg-red-100 { background: #fed7d7; }
	.text-red-800 { color: #742a2a; }
	.bg-orange-100 { background: #feebc8; }
	.text-orange-800 { color: #7c2d12; }

	@media (max-width: 768px) {
		.header-content {
			flex-direction: column;
			gap: 16px;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}

		.user-info {
			align-items: center;
		}
	}
</style>
