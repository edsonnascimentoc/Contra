<script lang="ts">
  import { auth } from '$lib/stores/auth.svelte';
  import { fetchAPI } from '$lib/api';
  import { BRAND_NAME, PRIMARY_COLOR } from '$lib/config';
  import { goto } from '$app/navigation';
  import { Lock, Mail, Loader2, AlertCircle } from 'lucide-svelte';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function handleLogin(e: Event) {
    e.preventDefault();
    loading = true;
    error = null;

    try {
      const response = await fetchAPI<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        auth.setSession(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
        goto('/');
      }
    } catch (err: any) {
      error = err.message || 'Falha na autenticação. Verifique suas credenciais.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - {BRAND_NAME}</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <div class="logo">🏗️</div>
      <h1>{BRAND_NAME}</h1>
      <p>Sistema de Gestão de Construção</p>
    </div>

    {#if error}
      <div class="error-banner">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    {/if}

    <form onsubmit={handleLogin} class="login-form">
      <div class="form-group">
        <label for="email">E-mail</label>
        <div class="input-wrapper">
          <span class="input-icon">
            <Mail size={20} />
          </span>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="seu@email.com"
            required
            autocomplete="email"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <div class="input-wrapper">
          <span class="input-icon">
            <Lock size={20} />
          </span>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>
      </div>

      <button type="submit" class="btn-login" disabled={loading}>
        {#if loading}
          <span class="spinner">
            <Loader2 size={20} />
          </span>
          <span>Autenticando...</span>
        {:else}
          <span>Entrar</span>
        {/if}
      </button>
    </form>

    <div class="login-footer">
      <p>&copy; {new Date().getFullYear()} National Group India. Todos os direitos reservados.</p>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 1rem;
  }

  .login-card {
    background: white;
    width: 100%;
    max-width: 400px;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .logo {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h1 {
    color: #1a1a1a;
    font-size: 1.75rem;
    margin: 0;
    font-weight: 700;
  }

  .login-header p {
    color: #666;
    margin-top: 0.5rem;
  }

  .error-banner {
    background: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 0.75rem;
    color: #9ca3af;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color, #d4af37);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }

  .btn-login {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-color, #d4af37);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
  }

  .btn-login:hover:not(:disabled) {
    background-color: #c09b2d;
  }

  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .login-footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }
</style>
