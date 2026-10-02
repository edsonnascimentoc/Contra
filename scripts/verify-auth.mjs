const API_URL = 'http://localhost:3001/api';

async function testAuth() {
  console.log('🧪 Iniciando testes de autenticação...');

  // 1. Tentar acessar rota protegida sem token
  console.log('\n1. Testando acesso não autorizado...');
  try {
    const res = await fetch(`${API_URL}/status`);
    console.log(`Status esperado (401): ${res.status}`);
    const data = await res.json();
    console.log('Resposta:', data);
  } catch (e) {
    console.error('Erro:', e.message);
  }

  // 2. Tentar login (usando dados do seed se existirem)
  console.log('\n2. Testando login...');
  let tokens = null;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nationalgroup.in',
        password: 'admin' // Senha padrão comum em seeds
      })
    });
    
    const data = await res.json();
    if (data.success) {
      console.log('✅ Login bem-sucedido!');
      tokens = data.data;
    } else {
      console.log('❌ Falha no login:', data.error);
    }
  } catch (e) {
    console.error('Erro no login:', e.message);
  }

  if (tokens) {
    // 3. Acessar rota protegida com token
    console.log('\n3. Testando acesso com Access Token...');
    try {
      const res = await fetch(`${API_URL}/status`, {
        headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
      });
      console.log(`Status esperado (200): ${res.status}`);
    } catch (e) {
      console.error('Erro no acesso:', e.message);
    }

    // 4. Testar Refresh Token
    console.log('\n4. Testando Refresh Token...');
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });
      const data = await res.json();
      if (data.success) {
        console.log('✅ Refresh bem-sucedido! Novo Access Token gerado.');
      } else {
        console.log('❌ Falha no refresh:', data.error);
      }
    } catch (e) {
      console.error('Erro no refresh:', e.message);
    }

    // 5. Testar Logout
    console.log('\n5. Testando Logout...');
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });
      const data = await res.json();
      console.log('Resposta logout:', data.message);

      // 6. Verificar se refresh token foi invalidado
      console.log('\n6. Verificando invalidação do refresh token...');
      const resRefresh = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });
      console.log(`Status esperado (401): ${resRefresh.status}`);
    } catch (e) {
      console.error('Erro no logout/verificação:', e.message);
    }
  }
}

testAuth();
