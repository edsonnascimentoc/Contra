# 🐛 TEMPLATE DE RELATÓRIO DE BUG

> **Instruções:** Preencha todas as seções obrigatórias marcadas com ⚠️. Seções opcionais podem ser preenchidas quando relevante.

---

## 📌 INFORMAÇÕES BÁSICAS

### ⚠️ Título do Bug
**[Componente] - Descrição curta e objetiva do problema**

**Exemplo:** `[Status Board] - Filtro de intervalo de datas não aplica filtro aos dados exibidos`

---

### ⚠️ ID do Bug
**BUG-[YYYY-MM-DD]-[XXX]**

**Exemplo:** `BUG-2024-01-15-001`

---

### ⚠️ Severidade
Selecione uma opção:

- [ ] **🔴 Crítica** - Sistema inoperante, perda de dados, falha de segurança
- [ ] **🟠 Alta** - Funcionalidade principal não funciona, sem workaround
- [ ] **🟡 Média** - Funcionalidade secundária afetada, workaround disponível
- [ ] **🟢 Baixa** - Problema cosmético, não afeta funcionalidade

**Justificativa:**
```
[Explique por que escolheu esta severidade]
```

---

### ⚠️ Prioridade
Selecione uma opção:

- [ ] **P0 - Urgente** - Corrigir imediatamente (< 24h)
- [ ] **P1 - Alta** - Corrigir na próxima sprint (< 1 semana)
- [ ] **P2 - Média** - Corrigir em 2-4 semanas
- [ ] **P3 - Baixa** - Backlog, sem prazo definido

---

### ⚠️ Status
- [ ] 🆕 Novo
- [ ] 🔍 Em Análise
- [ ] ✅ Confirmado
- [ ] 🔄 Em Desenvolvimento
- [ ] 🧪 Em Teste
- [ ] ✔️ Resolvido
- [ ] ❌ Fechado
- [ ] 🔁 Reaberto

---

### ⚠️ Frequência de Reprodução
- [ ] **Sempre (100%)** - Ocorre toda vez
- [ ] **Frequente (75-99%)** - Ocorre na maioria das vezes
- [ ] **Ocasional (25-74%)** - Ocorre às vezes
- [ ] **Raro (< 25%)** - Difícil de reproduzir
- [ ] **Não reproduzível** - Ocorreu apenas uma vez

---

## 🖥️ AMBIENTE

### ⚠️ Informações do Sistema

| Campo | Valor |
|-------|-------|
| **URL da Aplicação** | `https://exemplo.com` |
| **Ambiente** | [ ] Produção [ ] Staging [ ] Desenvolvimento [ ] Local |
| **Versão da Aplicação** | `v1.2.3` |
| **Navegador** | Chrome 120.0.6099.100 |
| **Sistema Operacional** | Windows 11 Pro (22H2) |
| **Dispositivo** | Desktop / Laptop / Tablet / Mobile |
| **Resolução de Tela** | 1920x1080 |
| **Data/Hora do Incidente** | 2024-01-15 14:30:00 BRT |

### Informações Adicionais do Ambiente (Opcional)
```
- Conexão: Wi-Fi / 4G / 5G
- Velocidade: [X] Mbps
- Extensões do Navegador: [Listar se relevante]
- Modo: Normal / Anônimo / Privado
```

---

## 📝 DESCRIÇÃO DO BUG

### ⚠️ Resumo Executivo
**Em 2-3 frases, descreva o problema:**
```
[Descrição clara e concisa do bug]
```

---

### ⚠️ Passos para Reproduzir

**Pré-condições:**
```
- Usuário deve estar logado
- Deve haver dados no sistema
- [Outras condições necessárias]
```

**Passos:**
1. Acesse a página [Nome da Página]
2. Clique em [Elemento/Botão]
3. Preencha o campo [Campo] com [Valor]
4. Clique em [Botão de Ação]
5. Observe [Resultado]

**Dados de Teste Utilizados:**
```
- Data de Início: 01/01/2024
- Data de Fim: 31/01/2024
- [Outros dados relevantes]
```

---

### ⚠️ Comportamento Esperado
**O que DEVERIA acontecer:**
```
[Descreva o comportamento correto esperado]
```

---

### ⚠️ Comportamento Observado
**O que REALMENTE aconteceu:**
```
[Descreva o comportamento incorreto observado]
```

---

### Impacto no Usuário
**Como isso afeta o usuário final:**
```
- [ ] Impede conclusão de tarefa crítica
- [ ] Causa frustração/confusão
- [ ] Perda de dados
- [ ] Perda de tempo
- [ ] Outro: [Especificar]
```

---

## 🔍 ANÁLISE TÉCNICA

### ⚠️ Logs do Console do Navegador

**Erros JavaScript:**
```javascript
// Cole aqui os erros do console (F12 > Console)
Uncaught TypeError: Cannot read property 'X' of undefined
    at fetchData (page.svelte:21)
```

**Warnings:**
```javascript
// Cole aqui os warnings relevantes
```

---

### ⚠️ Requisições de Rede (Network Tab)

**Requisição Problemática:**
```http
GET /api/status HTTP/1.1
Host: exemplo.com
```

**Query Parameters Enviados:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Resposta do Servidor:**
```json
{
  "status": 200,
  "data": [...]
}
```

**Status Code:** `200 OK` / `400 Bad Request` / `500 Internal Server Error`

---

### Inspeção de Elementos (DevTools)

**Elemento HTML Relevante:**
```html
<input id="start-date" type="date" value="2024-01-01" />
```

**Atributos Importantes:**
```
- ID: start-date
- Class: form-input
- Value: 2024-01-01
- Disabled: false
- ReadOnly: false
```

---

### Logs do Servidor (Se Disponível)

```
[2024-01-15 14:30:00] ERROR: Database query failed
[2024-01-15 14:30:00] Stack trace: ...
```

---

## 📸 EVIDÊNCIAS

### ⚠️ Capturas de Tela

**Antes da Ação:**
```
[Anexar screenshot mostrando estado inicial]
Arquivo: bug-001-before.png
```

**Depois da Ação:**
```
[Anexar screenshot mostrando o bug]
Arquivo: bug-001-after.png
```

**Console/Network Tab:**
```
[Anexar screenshot dos erros/requisições]
Arquivo: bug-001-console.png
```

---

### Vídeo de Reprodução (Altamente Recomendado)
```
[Link para vídeo ou arquivo anexado]
Arquivo: bug-001-reproduction.mp4
Duração: 45 segundos
```

---

### Arquivos de Log
```
[Anexar arquivos de log relevantes]
- application.log
- error.log
- network.har (exportado do DevTools)
```

---

## 🧪 TESTES REALIZADOS

### Variações Testadas

| Cenário | Resultado | Observações |
|---------|-----------|-------------|
| Data início = Data fim | ❌ Falha | Mesmo comportamento |
| Intervalo de 1 dia | ❌ Falha | Não filtra |
| Intervalo de 30 dias | ❌ Falha | Não filtra |
| Sem preencher datas | ✅ Funciona | Mostra todos os dados |
| Navegador diferente | ❌ Falha | Bug persiste |
| Modo anônimo | ❌ Falha | Bug persiste |

---

### Workaround Disponível?
- [ ] **Sim** - Descreva abaixo
- [ ] **Não** - Sem alternativa

**Descrição do Workaround:**
```
[Se houver, descreva como contornar o problema temporariamente]
```

---

## 🔧 ANÁLISE DE CAUSA RAIZ (Para Desenvolvedores)

### Possível Causa
```
[Hipótese sobre a causa do bug - opcional, não presuma a solução]
Exemplo: Os parâmetros de data não estão sendo enviados na requisição HTTP
```

---

### Arquivos/Componentes Afetados
```
- src/routes/+page.svelte (linha 21)
- server/routes/status.js (linha 7-14)
- [Outros arquivos relevantes]
```

---

### Sugestão de Correção (Opcional)
```
[Sugestão técnica de como corrigir - apenas se tiver conhecimento técnico]
```

---

## 📊 INFORMAÇÕES ADICIONAIS

### Contexto de Negócio
```
[Por que esta funcionalidade é importante? Qual o impacto no negócio?]
```

---

### Bugs Relacionados
```
- BUG-2024-01-10-005 (Filtro de datas em outra página)
- BUG-2024-01-12-012 (Problema similar)
```

---

### Histórico de Mudanças Recentes
```
[Houve deploy recente? Mudanças relacionadas?]
- Deploy v1.2.3 em 2024-01-14
- Alteração no componente de filtro
```

---

## 👥 RESPONSÁVEIS

| Papel | Nome | Email | Status |
|-------|------|-------|--------|
| **Reportado por** | [Nome do QA] | qa@exemplo.com | - |
| **Atribuído a** | [Nome do Dev] | dev@exemplo.com | 🔄 Em análise |
| **Revisado por** | [Nome do Tech Lead] | lead@exemplo.com | - |
| **Testado por** | [Nome do QA] | qa@exemplo.com | - |

---

## 📅 TIMELINE

| Data | Evento | Responsável |
|------|--------|-------------|
| 2024-01-15 14:30 | Bug descoberto | QA Team |
| 2024-01-15 15:00 | Bug reportado | QA Team |
| 2024-01-15 16:00 | Em análise | Dev Team |
| [Data] | Correção implementada | Dev Team |
| [Data] | Em teste | QA Team |
| [Data] | Resolvido | - |

---

## ✅ CHECKLIST DE QUALIDADE DO RELATÓRIO

Antes de enviar, verifique:

- [ ] Título claro e descritivo
- [ ] Severidade e prioridade definidas
- [ ] Passos para reproduzir detalhados
- [ ] Comportamento esperado vs observado documentado
- [ ] Ambiente completamente especificado
- [ ] Screenshots/vídeo anexados
- [ ] Logs do console incluídos
- [ ] Network tab analisado
- [ ] Frequência de reprodução testada
- [ ] Variações testadas
- [ ] Dados de teste especificados
- [ ] Impacto no usuário descrito

---

## 📝 NOTAS ADICIONAIS

```
[Qualquer informação adicional relevante que não se encaixe nas seções acima]
```

---

## 🔗 REFERÊNCIAS

- **Documentação:** [Link para docs]
- **User Story:** [Link para história de usuário]
- **Design/Mockup:** [Link para design]
- **Ticket no Jira/GitHub:** [Link]

---

**Template Version:** 1.0  
**Última Atualização:** 2024-01-15  
**Mantido por:** QA Team

---

## 📚 GUIA DE PREENCHIMENTO

### Como usar este template:

1. **Copie este template** para um novo arquivo ou sistema de tickets
2. **Preencha todas as seções obrigatórias** (marcadas com ⚠️)
3. **Anexe evidências** (screenshots, vídeos, logs)
4. **Revise o checklist** antes de enviar
5. **Atribua ao responsável** apropriado

### Dicas para um bom relatório:

✅ **Seja específico:** Use dados concretos, não generalizações  
✅ **Seja objetivo:** Fatos, não opiniões  
✅ **Seja completo:** Inclua todas as informações relevantes  
✅ **Seja claro:** Use linguagem simples e direta  
✅ **Seja visual:** Screenshots valem mais que mil palavras  

❌ **Evite:** "Não funciona", "Está quebrado", "Às vezes dá erro"  
✅ **Prefira:** "Ao clicar em X, esperava Y, mas obtive Z"

---

## 🎯 EXEMPLO PREENCHIDO

Para ver um exemplo completo de como preencher este template, consulte:
`docs/qa/EXEMPLO_BUG_REPORT.md`
