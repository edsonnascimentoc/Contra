import { API_BASE } from './config';
import { auth } from './stores/auth.svelte';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  // Adicionar token se existir
  if (auth.accessToken) {
    headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  // Garantir JSON se não especificado
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    console.log(`🔄 Fetching from: ${API_BASE}${endpoint}`);
    
    let response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    // Tratar 401 (Não autorizado) - Tentar Refresh Token
    if (response.status === 401 && auth.refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: auth.refreshToken })
          });

          if (refreshResponse.ok) {
            const { data } = await refreshResponse.json();
            auth.updateAccessToken(data.accessToken);
            isRefreshing = false;
            onTokenRefreshed(data.accessToken);
          } else {
            // Se falhar o refresh, deslogar
            isRefreshing = false;
            await auth.logout();
            throw new Error('Sessão expirada. Faça login novamente.');
          }
        } catch (e) {
          isRefreshing = false;
          await auth.logout();
          throw e;
        }
      }

      // Aguardar o refresh terminar se outra requisição já disparou
      const newToken = await new Promise<string>((resolve) => {
        addRefreshSubscriber((token) => resolve(token));
      });

      // Refazer a requisição original com o novo token
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });
    }

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `Erro ${response.status}`;
      
      if (response.status === 404) {
        errorMessage = 'Endpoint não encontrado. Verifique a URL da API.';
      } else {
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = text.substring(0, 100) || errorMessage;
        }
      }
      
      console.error('❌ HTTP Error:', response.status, text);
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Invalid Content-Type:', contentType);
      throw new Error('API retornou resposta inválida (esperado JSON)');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar dados:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
    
    throw error;
  }
}

