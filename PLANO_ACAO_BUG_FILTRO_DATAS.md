# 📋 PLANO DE AÇÃO: Bug no Filtro de Intervalo de Datas - Quadro de Status

## 🎯 Objetivo
Implementar duas soluções complementares:
1. **Investigar e corrigir o bug** no código da aplicação
2. **Criar template de relatório de bug** padronizado para o time de QA

---

## 📊 OPÇÃO 1: INVESTIGAÇÃO E CORREÇÃO DO BUG

### 🔍 Fase 1: Análise do Problema (Identificado)

#### **Problema Raiz Encontrado:**
- **Localização:** `src/routes/+page.svelte` (linhas 18-34)
- **Causa:** O filtro de datas **NÃO está sendo aplicado** ao Status Board
- **Evidência:** A requisição `fetch(\`${API_BASE}/status\`)` na linha 21 **não inclui parâmetros de data**
- **Impacto:** Apenas o `dailyStats` usa o filtro de datas (linha 29), mas o Status Board sempre retorna todos os registros

#### **Código Problemático:**
```typescript
// Linha 21 - NÃO usa filtro de datas
const statusResponse = await fetch(`${API_BASE}/status`);
statusData = await statusResponse.json();

// Linha 29 - USA filtro de datas (correto)
const statsResponse = await fetch(`${API_BASE}/daily-updates/stats?startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`);
```

#### **Backend Confirmado:**
- **Arquivo:** `server/routes/status.js` (linha 7-14)
- **Problema:** O endpoint `/api/status` **não aceita parâmetros de data**
- **Query SQL:** `SELECT * FROM status_board ORDER BY created_at DESC` (sem filtro WHERE)

---

### 🛠️ Fase 2: Plano de Correção

#### **Etapa 2.1: Modificar Backend (server/routes/status.js)**

**Ações:**
1. Adicionar suporte a query parameters `startDate` e `endDate`
2. Implementar filtro SQL com cláusula WHERE
3. Validar formato de datas
4. Manter retrocompatibilidade (se não houver datas, retornar todos)

**Implementação:**
```javascript
// GET /api/status?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/', (req, res) => {
  const { startDate, endDate } = req.query;
  
  let query = 'SELECT * FROM status_board';
  let params = [];
  
  if (startDate && endDate) {
    query += ' WHERE (start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?) OR (start_date <= ? AND end_date >= ?)';
    params = [startDate, endDate, startDate, endDate, startDate, endDate];
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});
```

**Lógica do Filtro:**
- Projetos que **iniciam** no intervalo
- Projetos que **terminam** no intervalo
- Projetos que **abrangem** o intervalo (começam antes e terminam depois)

---

#### **Etapa 2.2: Modificar Frontend (src/routes/+page.svelte)**

**Ações:**
1. Adicionar parâmetros de data na requisição do Status Board
2. Garantir consistência com o filtro de dailyStats

**Implementação:**
```typescript
async function fetchData() {
  try {
    // Fetch status board data COM FILTRO DE DATAS
    const statusResponse = await fetch(
      `${API_BASE}/status?startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`
    );
    statusData = await statusResponse.json();
    
    // Fetch construction phases
    const phasesResponse = await fetch(`${API_BASE}/status/phases`);
    phases = await phasesResponse.json();
    
    // Fetch daily stats
    const statsResponse = await fetch(
      `${API_BASE}/daily-updates/stats?startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`
    );
    dailyStats = await statsResponse.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
```

---

#### **Etapa 2.3: Testes de Validação**

**Casos de Teste:**

| # | Cenário | Data Início | Data Fim | Resultado Esperado |
|---|---------|-------------|----------|-------------------|
| 1 | Intervalo normal | 01/01/2024 | 31/01/2024 | Projetos dentro do período |
| 2 | Mesma data | 15/01/2024 | 15/01/2024 | Projetos ativos nesse dia |
| 3 | Sem datas | null | null | Todos os projetos |
| 4 | Data fim < início | 31/01/2024 | 01/01/2024 | Validação de erro ou array vazio |
| 5 | Datas futuras | 01/01/2025 | 31/12/2025 | Projetos futuros |
| 6 | Intervalo longo | 01/01/2023 | 31/12/2024 | Múltiplos projetos |

**Checklist de Testes:**
- [ ] Filtro aplica corretamente no Status Board
- [ ] Filtro aplica corretamente no Daily Stats
- [ ] Botão "Update" funciona
- [ ] Evento `on:change` nos inputs funciona
- [ ] Console do navegador sem erros
- [ ] Network tab mostra parâmetros corretos
- [ ] Resposta do servidor contém dados filtrados
- [ ] Performance adequada (< 2s)

---

#### **Etapa 2.4: Melhorias Adicionais (Opcional)**

**Sugestões:**
1. **Feedback Visual:**
   - Mostrar contador de registros filtrados
   - Indicador de "Filtro Ativo"
   - Loading spinner durante fetch

2. **Validação de Datas:**
   - Impedir data fim < data início
   - Limitar intervalo máximo (ex: 1 ano)
   - Mensagem de erro amigável

3. **UX Melhorada:**
   - Botão "Limpar Filtro"
   - Presets (Hoje, Esta Semana, Este Mês)
   - Salvar filtro no localStorage

4. **Filtro para Construction Phases:**
   - Aplicar mesmo filtro nas fases de construção
   - Endpoint `/api/status/phases?startDate=X&endDate=Y`

---

### 📝 Fase 3: Documentação da Correção

**Criar arquivo:** `docs/BUGFIX_DATE_FILTER.md`

**Conteúdo:**
- Descrição do bug
- Causa raiz
- Solução implementada
- Testes realizados
- Breaking changes (se houver)
- Instruções de deploy

---

## 📄 OPÇÃO 2: TEMPLATE DE RELATÓRIO DE BUG

### 📋 Estrutura do Template

**Criar arquivo:** `docs/qa/BUG_REPORT_TEMPLATE.md`

---

## 🗓️ CRONOGRAMA DE EXECUÇÃO

### **Sprint 1: Investigação e Correção (3-5 dias)**

| Dia | Atividade | Responsável | Status |
|-----|-----------|-------------|--------|
| 1 | Análise completa do código | Dev Backend | ✅ Concluído |
| 1-2 | Implementar correção backend | Dev Backend | 🔄 Pendente |
| 2 | Implementar correção frontend | Dev Frontend | 🔄 Pendente |
| 3 | Testes unitários | Dev | 🔄 Pendente |
| 3-4 | Testes de integração | QA | 🔄 Pendente |
| 4 | Code review | Tech Lead | 🔄 Pendente |
| 5 | Deploy em staging | DevOps | 🔄 Pendente |
| 5 | Validação final | QA | 🔄 Pendente |

### **Sprint 2: Template e Documentação (1-2 dias)**

| Dia | Atividade | Responsável | Status |
|-----|-----------|-------------|--------|
| 1 | Criar template de bug report | QA Lead | 🔄 Pendente |
| 1 | Criar guia de preenchimento | QA Lead | 🔄 Pendente |
| 2 | Treinamento do time QA | QA Lead | 🔄 Pendente |
| 2 | Integrar com sistema de tickets | DevOps | 🔄 Pendente |

---

## 🎯 CRITÉRIOS DE SUCESSO

### **Correção do Bug:**
- ✅ Filtro de datas funciona no Status Board
- ✅ Todos os testes passam
- ✅ Sem regressões em outras funcionalidades
- ✅ Performance mantida ou melhorada
- ✅ Documentação atualizada

### **Template de Bug Report:**
- ✅ Template criado e aprovado
- ✅ Time QA treinado
- ✅ Integrado ao workflow
- ✅ Primeiros 5 bugs reportados usando template

---

## 🚀 PRÓXIMOS PASSOS

### **Imediato:**
1. ✅ Aprovar este plano de ação
2. 🔄 Criar branch `bugfix/date-filter-status-board`
3. 🔄 Implementar correção backend
4. 🔄 Implementar correção frontend

### **Curto Prazo:**
1. 🔄 Executar testes
2. 🔄 Code review
3. 🔄 Deploy staging
4. 🔄 Validação QA

### **Médio Prazo:**
1. 🔄 Deploy produção
2. 🔄 Monitoramento pós-deploy
3. 🔄 Criar template de bug report
4. 🔄 Treinamento do time

---

## 📞 CONTATOS E RESPONSÁVEIS

| Papel | Nome | Responsabilidade |
|-------|------|------------------|
| Tech Lead | [Nome] | Aprovação técnica |
| Dev Backend | [Nome] | Correção server/routes/status.js |
| Dev Frontend | [Nome] | Correção src/routes/+page.svelte |
| QA Lead | [Nome] | Validação e template |
| DevOps | [Nome] | Deploy e monitoramento |

---

## 📚 REFERÊNCIAS

- **Arquivos Afetados:**
  - `src/routes/+page.svelte` (linhas 18-34, 123, 127, 129)
  - `server/routes/status.js` (linhas 6-15)
  
- **Documentação Relacionada:**
  - API Documentation: `README.md`
  - Database Schema: `server/database/init.js`
  - Installation Guide: `INSTALLATION_GUIDE.md`

---

**Última Atualização:** [Data Atual]  
**Versão:** 1.0  
**Status:** 🔄 Em Andamento
