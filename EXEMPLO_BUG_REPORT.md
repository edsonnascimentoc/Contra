# 🐛 EXEMPLO DE RELATÓRIO DE BUG PREENCHIDO

> Este é um exemplo real de como preencher o template de bug report para o bug do filtro de datas no Status Board.

---

## 📌 INFORMAÇÕES BÁSICAS

### ⚠️ Título do Bug
**[Status Board] - Filtro de intervalo de datas não aplica filtro aos dados exibidos**

---

### ⚠️ ID do Bug
**BUG-2024-01-15-001**

---

### ⚠️ Severidade
- [ ] 🔴 Crítica
- [x] 🟠 Alta
- [ ] 🟡 Média
- [ ] 🟢 Baixa

**Justificativa:**
```
A funcionalidade de filtragem é essencial para análise de dados por período.
Sem ela, usuários não conseguem visualizar projetos específicos de um intervalo,
impactando diretamente a tomada de decisão e relatórios gerenciais.
Não há workaround disponível.
```

---

### ⚠️ Prioridade
- [ ] P0 - Urgente
- [x] P1 - Alta
- [ ] P2 - Média
- [ ] P3 - Baixa

---

### ⚠️ Status
- [ ] 🆕 Novo
- [ ] 🔍 Em Análise
- [x] ✅ Confirmado
- [ ] 🔄 Em Desenvolvimento
- [ ] 🧪 Em Teste
- [ ] ✔️ Resolvido
- [ ] ❌ Fechado
- [ ] 🔁 Reaberto

---

### ⚠️ Frequência de Reprodução
- [x] **Sempre (100%)** - Ocorre toda vez
- [ ] Frequente (75-99%)
- [ ] Ocasional (25-74%)
- [ ] Raro (< 25%)
- [ ] Não reproduzível

---

## 🖥️ AMBIENTE

### ⚠️ Informações do Sistema

| Campo | Valor |
|-------|-------|
| **URL da Aplicação** | `http://localhost:5173/` |
| **Ambiente** | [ ] Produção [ ] Staging [x] Desenvolvimento [ ] Local |
| **Versão da Aplicação** | `v1.0.0` |
| **Navegador** | Chrome 120.0.6099.100 (64-bit) |
| **Sistema Operacional** | Windows 11 Pro (22H2, Build 22621.3007) |
| **Dispositivo** | Desktop |
| **Resolução de Tela** | 1920x1080 |
| **Data/Hora do Incidente** | 2024-01-15 14:30:00 BRT |

### Informações Adicionais do Ambiente
```
- Conexão: Wi-Fi (100 Mbps)
- Extensões do Navegador: React DevTools, Vue DevTools (desabilitadas durante teste)
- Modo: Normal (também testado em modo anônimo com mesmo resultado)
- Node.js: v18.17.0
- npm: v9.6.7
```

---

## 📝 DESCRIÇÃO DO BUG

### ⚠️ Resumo Executivo
```
Na página "Quadro de Status" (Status Board), ao selecionar um intervalo de datas
nos campos "Data de Início" e "Data de Fim" e clicar no botão "Update", o filtro
não é aplicado aos dados exibidos na tabela. Todos os projetos continuam sendo
exibidos, independentemente das datas selecionadas.
```

---

### ⚠️ Passos para Reproduzir

**Pré-condições:**
```
- Aplicação rodando localmente (npm run dev)
- Banco de dados populado com pelo menos 5 projetos
- Projetos devem ter datas diferentes (start_date e end_date)
- Navegador com JavaScript habilitado
```

**Passos:**
1. Acesse a aplicação em `http://localhost:5173/`
2. Aguarde o carregamento completo da página "Status Board"
3. Localize a seção "📅 Date Range Filter" no topo da página
4. No campo "Start Date", selecione a data `01/01/2024`
5. No campo "End Date", selecione a data `31/01/2024`
6. Clique no botão azul "Update"
7. Observe a tabela "🏢 Project Status Board" abaixo

**Dados de Teste Utilizados:**
```
- Data de Início: 01/01/2024
- Data de Fim: 31/01/2024
- Projetos no banco:
  * Projeto A: 15/12/2023 - 15/02/2024 (deveria aparecer)
  * Projeto B: 10/01/2024 - 20/01/2024 (deveria aparecer)
  * Projeto C: 01/03/2024 - 30/03/2024 (NÃO deveria aparecer)
  * Projeto D: 01/11/2023 - 30/11/2023 (NÃO deveria aparecer)
  * Projeto E: 01/05/2024 - 31/05/2024 (NÃO deveria aparecer)
```

---

### ⚠️ Comportamento Esperado
```
Após clicar em "Update", a tabela "Project Status Board" deveria exibir APENAS
os projetos cujas datas (start_date ou end_date) se encaixam no intervalo
selecionado (01/01/2024 a 31/01/2024).

Resultado esperado:
- Projeto A: ✅ Exibido (termina em 15/02/2024, dentro do intervalo)
- Projeto B: ✅ Exibido (totalmente dentro do intervalo)
- Projeto C: ❌ Oculto (inicia após o intervalo)
- Projeto D: ❌ Oculto (termina antes do intervalo)
- Projeto E: ❌ Oculto (inicia após o intervalo)

Total esperado: 2 projetos exibidos
```

---

### ⚠️ Comportamento Observado
```
Após clicar em "Update", TODOS os 5 projetos continuam sendo exibidos na tabela,
independentemente das datas selecionadas. O filtro não tem nenhum efeito visível.

Resultado observado:
- Projeto A: ✅ Exibido (incorreto - deveria estar)
- Projeto B: ✅ Exibido (incorreto - deveria estar)
- Projeto C: ✅ Exibido (INCORRETO - NÃO deveria estar)
- Projeto D: ✅ Exibido (INCORRETO - NÃO deveria estar)
- Projeto E: ✅ Exibido (INCORRETO - NÃO deveria estar)

Total observado: 5 projetos exibidos (deveria ser 2)

Observação adicional: A seção "Dashboard Statistics" mostra "5 Active Projects"
mesmo após aplicar o filtro, confirmando que nenhum filtro foi aplicado.
```

---

### Impacto no Usuário
```
- [x] Impede conclusão de tarefa crítica
- [x] Causa frustração/confusão
- [ ] Perda de dados
- [x] Perda de tempo
- [x] Outro: Impossibilita geração de relatórios por período

Descrição do impacto:
- Gerentes de projeto não conseguem visualizar status de projetos específicos
- Relatórios mensais/trimestrais não podem ser gerados
- Análise de performance por período fica impossível
- Usuários precisam filtrar manualmente os dados (ineficiente)
- Perda de confiança na ferramenta
```

---

## 🔍 ANÁLISE TÉCNICA

### ⚠️ Logs do Console do Navegador

**Erros JavaScript:**
```javascript
// Nenhum erro JavaScript foi encontrado no console
// O console está limpo, sem erros ou exceções
```

**Warnings:**
```javascript
// Nenhum warning relevante
```

**Logs de Debug:**
```javascript
// Ao abrir o DevTools e observar o Network tab, notei que:
// 1. A requisição para /api/status NÃO inclui parâmetros de data
// 2. A requisição para /api/daily-updates/stats INCLUI os parâmetros (funciona)
```

---

### ⚠️ Requisições de Rede (Network Tab)

**Requisição Problemática #1 (Status Board):**
```http
GET /api/status HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Query Parameters Enviados:**
```
NENHUM - Esta é a causa do bug!
A URL não contém ?startDate=... nem &endDate=...
```

**Resposta do Servidor:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "project_name": "Projeto A",
    "phase": "Foundation",
    "status": "in_progress",
    "progress": 65,
    "start_date": "2023-12-15",
    "end_date": "2024-02-15"
  },
  {
    "id": 2,
    "project_name": "Projeto B",
    "phase": "Structure",
    "status": "in_progress",
    "progress": 45,
    "start_date": "2024-01-10",
    "end_date": "2024-01-20"
  },
  // ... todos os 5 projetos retornados
]
```

**Status Code:** `200 OK`

---

**Requisição Correta #2 (Daily Stats - para comparação):**
```http
GET /api/daily-updates/stats?startDate=2024-01-01&endDate=2024-01-31 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Query Parameters Enviados:**
```
startDate=2024-01-01
endDate=2024-01-31
```

**Resposta do Servidor:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "avg_manpower": 45,
  "total_safety_incidents": 2,
  // ... dados filtrados corretamente
}
```

**Análise:**
```
A requisição para /api/daily-updates/stats FUNCIONA corretamente porque
inclui os parâmetros de data na URL. A requisição para /api/status NÃO
funciona porque não envia os parâmetros.
```

---

### Inspeção de Elementos (DevTools)

**Campo "Start Date":**
```html
<input 
  id="start-date" 
  type="date" 
  class="form-input" 
  value="2024-01-01"
>
```

**Campo "End Date":**
```html
<input 
  id="end-date" 
  type="date" 
  class="form-input" 
  value="2024-01-31"
>
```

**Botão "Update":**
```html
<button class="btn btn-primary">Update</button>
```

**Atributos Importantes:**
```
- Campos de data estão corretamente preenchidos
- Valores estão no formato correto (YYYY-MM-DD)
- Campos não estão disabled ou readonly
- Evento on:click está vinculado ao botão
- Binding bind:value está funcionando (valores mudam no DOM)
```

---

### Logs do Servidor

```bash
# Terminal do servidor (npm run dev)
[14:30:15] GET /api/status 200 - 15ms
[14:30:15] GET /api/status/phases 200 - 8ms
[14:30:15] GET /api/daily-updates/stats?startDate=2024-01-01&endDate=2024-01-31 200 - 12ms

# Observação: A requisição /api/status não mostra parâmetros de query
```

---

## 📸 EVIDÊNCIAS

### ⚠️ Capturas de Tela

**Antes da Ação:**
```
Arquivo: bug-001-before.png
Descrição: Página carregada, campos de data vazios, 5 projetos exibidos
```

**Depois da Ação:**
```
Arquivo: bug-001-after.png
Descrição: Campos preenchidos (01/01/2024 - 31/01/2024), botão clicado,
           mas ainda 5 projetos exibidos (deveria ser 2)
```

**Console/Network Tab:**
```
Arquivo: bug-001-network.png
Descrição: Network tab mostrando requisição GET /api/status SEM parâmetros
```

**Comparação com Daily Stats:**
```
Arquivo: bug-001-comparison.png
Descrição: Mostrando que /api/daily-updates/stats INCLUI os parâmetros
```

---

### Vídeo de Reprodução
```
Arquivo: bug-001-reproduction.mp4
Duração: 45 segundos
Descrição: Vídeo mostrando:
  1. Carregamento da página (0:00-0:05)
  2. Preenchimento dos campos de data (0:05-0:15)
  3. Clique no botão Update (0:15-0:20)
  4. Observação de que nada mudou (0:20-0:30)
  5. Abertura do DevTools e Network tab (0:30-0:45)
```

---

### Arquivos de Log
```
- network.har (exportado do DevTools)
- console-log.txt (log completo do console)
```

---

## 🧪 TESTES REALIZADOS

### Variações Testadas

| Cenário | Resultado | Observações |
|---------|-----------|-------------|
| Data início = Data fim (15/01/2024) | ❌ Falha | Todos os 5 projetos exibidos |
| Intervalo de 1 dia (15/01 - 16/01) | ❌ Falha | Todos os 5 projetos exibidos |
| Intervalo de 30 dias (01/01 - 31/01) | ❌ Falha | Todos os 5 projetos exibidos |
| Intervalo de 1 ano (01/01/24 - 31/12/24) | ❌ Falha | Todos os 5 projetos exibidos |
| Sem preencher datas (campos vazios) | ✅ Funciona | Mostra todos (comportamento correto) |
| Apenas Start Date preenchida | ❌ Falha | Todos os 5 projetos exibidos |
| Apenas End Date preenchida | ❌ Falha | Todos os 5 projetos exibidos |
| Data fim < data início (31/01 - 01/01) | ❌ Falha | Sem validação, todos exibidos |
| Chrome 120 | ❌ Falha | Bug persiste |
| Firefox 121 | ❌ Falha | Bug persiste |
| Edge 120 | ❌ Falha | Bug persiste |
| Modo anônimo (Chrome) | ❌ Falha | Bug persiste |
| Após limpar cache | ❌ Falha | Bug persiste |
| Após reload (F5) | ❌ Falha | Bug persiste |
| Após hard reload (Ctrl+Shift+R) | ❌ Falha | Bug persiste |

**Conclusão:** O bug é consistente em 100% dos casos testados, independente de:
- Intervalo de datas escolhido
- Navegador utilizado
- Modo de navegação
- Estado do cache

---

### Workaround Disponível?
- [ ] Sim
- [x] Não

**Descrição do Workaround:**
```
Não há workaround disponível. A única alternativa é:
1. Exportar todos os dados
2. Filtrar manualmente em Excel/Planilha
3. Analisar os dados filtrados

Isso é extremamente ineficiente e derrota o propósito da ferramenta.
```

---

## 🔧 ANÁLISE DE CAUSA RAIZ (Para Desenvolvedores)

### Possível Causa
```
Após análise do código-fonte, identifiquei a causa raiz:

ARQUIVO: src/routes/+page.svelte
LINHA: 21

Código atual:
  const statusResponse = await fetch(`${API_BASE}/status`);

Problema: A requisição NÃO inclui os parâmetros selectedDateRange.start
e selectedDateRange.end na URL.

Comparação com código que FUNCIONA (linha 29):
  const statsResponse = await fetch(
    `${API_BASE}/daily-updates/stats?startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`
  );

ARQUIVO: server/routes/status.js
LINHA: 7-14

Código atual:
  router.get('/', (req, res) => {
    db.all('SELECT * FROM status_board ORDER BY created_at DESC', (err, rows) => {
      // ...
    });
  });

Problema: O endpoint NÃO aceita nem processa parâmetros de query startDate/endDate.
A query SQL não possui cláusula WHERE para filtrar por datas.

CONCLUSÃO:
O bug existe em DOIS lugares:
1. Frontend não envia os parâmetros
2. Backend não aceita/processa os parâmetros

Ambos precisam ser corrigidos.
```

---

### Arquivos/Componentes Afetados
```
Frontend:
- src/routes/+page.svelte
  * Linha 21: fetch sem parâmetros de data
  * Linha 18-34: função fetchData()
  * Linha 123: input start-date
  * Linha 127: input end-date
  * Linha 129: botão Update

Backend:
- server/routes/status.js
  * Linha 7-14: endpoint GET / sem suporte a filtro de datas
  * Query SQL sem cláusula WHERE

Database:
- Tabela: status_board
  * Colunas: start_date, end_date (existem e estão populadas)
```

---

### Sugestão de Correção

**Frontend (src/routes/+page.svelte, linha 21):**
```typescript
// ANTES:
const statusResponse = await fetch(`${API_BASE}/status`);

// DEPOIS:
const statusResponse = await fetch(
  `${API_BASE}/status?startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`
);
```

**Backend (server/routes/status.js, linha 7-14):**
```javascript
// ANTES:
router.get('/', (req, res) => {
  db.all('SELECT * FROM status_board ORDER BY created_at DESC', (err, rows) => {
    // ...
  });
});

// DEPOIS:
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

**Lógica do Filtro SQL:**
- Projetos que iniciam no intervalo: `start_date BETWEEN ? AND ?`
- Projetos que terminam no intervalo: `end_date BETWEEN ? AND ?`
- Projetos que abrangem o intervalo: `start_date <= ? AND end_date >= ?`

---

## 📊 INFORMAÇÕES ADICIONAIS

### Contexto de Negócio
```
O filtro de datas no Status Board é uma funcionalidade crítica para:

1. Gerentes de Projeto:
   - Visualizar projetos ativos em um período específico
   - Gerar relatórios mensais/trimestrais
   - Analisar carga de trabalho por período

2. Diretoria:
   - Acompanhar progresso de projetos em períodos fiscais
   - Tomar decisões baseadas em dados históricos
   - Planejar recursos futuros

3. Clientes:
   - Visualizar status de seus projetos em datas específicas
   - Validar cumprimento de prazos contratuais

Impacto financeiro:
- Relatórios atrasados podem causar multas contratuais
- Decisões erradas por falta de dados filtrados
- Perda de tempo da equipe (estimado: 2h/dia de trabalho manual)
```

---

### Bugs Relacionados
```
Nenhum bug relacionado encontrado no sistema de tickets.

Possíveis bugs similares a investigar:
- Verificar se outros filtros de data na aplicação funcionam corretamente
- Testar filtro de datas em /labor, /materials, /daily-updates
```

---

### Histórico de Mudanças Recentes
```
Consultando o git log:

commit abc123def456 (HEAD -> main)
Date: 2024-01-10
Message: "Initial implementation of Status Board"

Análise: O filtro de datas foi implementado na versão inicial, mas
aparentemente nunca funcionou. Não houve testes automatizados para
validar esta funcionalidade.

Recomendação: Adicionar testes E2E para filtros de data após correção.
```

---

## 👥 RESPONSÁVEIS

| Papel | Nome | Email | Status |
|-------|------|-------|--------|
| **Reportado por** | João Silva (QA) | joao.silva@exemplo.com | - |
| **Atribuído a** | Maria Santos (Dev Backend) | maria.santos@exemplo.com | 🔄 Em análise |
| **Atribuído a** | Pedro Costa (Dev Frontend) | pedro.costa@exemplo.com | 🔄 Em análise |
| **Revisado por** | Ana Oliveira (Tech Lead) | ana.oliveira@exemplo.com | ⏳ Aguardando |
| **Testado por** | João Silva (QA) | joao.silva@exemplo.com | ⏳ Aguardando correção |

---

## 📅 TIMELINE

| Data | Evento | Responsável |
|------|--------|-------------|
| 2024-01-15 14:30 | Bug descoberto durante teste exploratório | João Silva (QA) |
| 2024-01-15 15:00 | Bug reportado no sistema | João Silva (QA) |
| 2024-01-15 15:30 | Análise técnica completa realizada | João Silva (QA) |
| 2024-01-15 16:00 | Bug confirmado e atribuído | Ana Oliveira (Tech Lead) |
| 2024-01-16 10:00 | Reunião de planejamento da correção | Dev Team |
| [Pendente] | Correção implementada | Dev Team |
| [Pendente] | Code review | Tech Lead |
| [Pendente] | Deploy em staging | DevOps |
| [Pendente] | Testes de validação | QA Team |
| [Pendente] | Deploy em produção | DevOps |
| [Pendente] | Bug resolvido | - |

---

## ✅ CHECKLIST DE QUALIDADE DO RELATÓRIO

- [x] Título claro e descritivo
- [x] Severidade e prioridade definidas
- [x] Passos para reproduzir detalhados
- [x] Comportamento esperado vs observado documentado
- [x] Ambiente completamente especificado
- [x] Screenshots/vídeo anexados
- [x] Logs do console incluídos
- [x] Network tab analisado
- [x] Frequência de reprodução testada
- [x] Variações testadas (15 cenários diferentes)
- [x] Dados de teste especificados
- [x] Impacto no usuário descrito
- [x] Análise de causa raiz realizada
- [x] Sugestão de correção fornecida
- [x] Arquivos afetados identificados
- [x] Contexto de negócio explicado

---

## 📝 NOTAS ADICIONAIS

```
1. Este bug provavelmente existe desde a implementação inicial (commit abc123def456)
   e nunca foi detectado porque não havia testes automatizados.

2. Recomendo fortemente a criação de testes E2E para validar filtros de data
   após a correção, para evitar regressões futuras.

3. Sugiro também revisar TODOS os outros filtros de data na aplicação
   (/labor, /materials, /daily-updates) para garantir que funcionam corretamente.

4. A correção é relativamente simples (estimativa: 2-4 horas de desenvolvimento
   + 2 horas de testes), mas o impacto no negócio é alto.

5. Prioridade P1 justificada: deve ser corrigido na próxima sprint.
```

---

## 🔗 REFERÊNCIAS

- **Documentação da API:** `README.md` (linha 57)
- **Schema do Banco:** `server/database/init.js` (linha 21-32)
- **Código Frontend:** `src/routes/+page.svelte`
- **Código Backend:** `server/routes/status.js`
- **Ticket no GitHub:** [A ser criado]
- **Branch para correção:** `bugfix/date-filter-status-board`

---

**Relatório criado por:** João Silva (QA Team)  
**Data:** 2024-01-15 15:30:00 BRT  
**Tempo de análise:** 1 hora  
**Template Version:** 1.0

---

## 🎓 LIÇÕES APRENDIDAS

Este relatório demonstra:
✅ Análise técnica profunda (código-fonte, network, console)
✅ Testes exaustivos (15 variações diferentes)
✅ Identificação precisa da causa raiz
✅ Sugestão de correção com código
✅ Contexto de negócio claro
✅ Documentação completa e acionável

Um relatório de bug de qualidade economiza tempo do time de desenvolvimento
e acelera a resolução do problema.
