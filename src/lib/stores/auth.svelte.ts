import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

class AuthStore {
  user = $state<User | null>(null);
  accessToken = $state<string | null>(null);
  refreshToken = $state<string | null>(null);
  initialized = $state(false);

  constructor() {
    if (browser) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    const savedUser = localStorage.getItem('auth_user');
    const savedAccessToken = localStorage.getItem('auth_access_token');
    const savedRefreshToken = localStorage.getItem('auth_refresh_token');

    if (savedUser && savedAccessToken && savedRefreshToken) {
      try {
        this.user = JSON.parse(savedUser);
        this.accessToken = savedAccessToken;
        this.refreshToken = savedRefreshToken;
      } catch (e) {
        console.error('Erro ao carregar sessão salva:', e);
        this.clearStorage();
      }
    }
    this.initialized = true;
  }

  private saveToStorage(user: User, accessToken: string, refreshToken: string) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_access_token', accessToken);
    localStorage.setItem('auth_refresh_token', refreshToken);
  }

  private clearStorage() {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_access_token');
    localStorage.removeItem('auth_refresh_token');
  }

  setSession(user: User, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (browser) {
      this.saveToStorage(user, accessToken, refreshToken);
    }
  }

  updateAccessToken(newToken: string) {
    this.accessToken = newToken;
    if (browser) {
      localStorage.setItem('auth_access_token', newToken);
    }
  }

  async logout() {
    const rt = this.refreshToken;
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    
    if (browser) {
      this.clearStorage();
      // Notificar backend (opcional, fire and forget)
      if (rt) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rt })
        }).catch(console.error);
      }
      goto('/login');
    }
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }
}

export const auth = new AuthStore();
