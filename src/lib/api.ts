import { API_BASE } from './config';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`🔄 Fetching from: ${API_BASE}${endpoint}`);
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('❌ HTTP Error:', response.status, text);
      throw new Error(`Erro ${response.status}: ${text.substring(0, 100)}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Invalid Content-Type:', contentType);
      console.error('Response:', text.substring(0, 200));
      throw new Error('API retornou resposta inválida (esperado JSON)');
    }
    
    const data = await response.json();
    console.log('✅ Data loaded:', Array.isArray(data) ? `${data.length} records` : 'object');
    return data;
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar dados:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } else if (error.message.includes('404')) {
      throw new Error('Endpoint não encontrado. Verifique a URL da API.');
    } else if (error.message.includes('não é JSON válido')) {
      throw new Error('API retornou resposta inválida. Verifique os logs do servidor.');
    }
    
    throw error;
  }
}
