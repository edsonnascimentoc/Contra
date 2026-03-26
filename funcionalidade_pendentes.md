# Funcionalidades Pendentes e Gestão de Estados

Este documento organiza as funcionalidades pendentes da aplicação **National Group India - Construction Management System**, ordenadas da menor para a maior dependência técnica. Compreender os estados de cada funcionalidade é essencial para garantir a estabilidade operacional, permitindo uma resposta rápida a incidentes e um planejamento eficaz de manutenções preventivas.

---

## 1. Autenticação e Gestão de Sessão (Login/Logout)
*Dependência: Baixa (Baseada apenas no Banco de Dados e JWT)*

A infraestrutura básica (modelos e utilitários) já existe no backend, mas a integração completa com a interface e rotas protegidas está pendente.

- **Normal**: Usuários realizam login com e-mail e senha, recebendo um token JWT válido. O acesso às áreas restritas é liberado e o logout limpa os tokens com segurança.
- **Atenção**: Lentidão na geração de tokens ou falhas esporádicas de renovação (Refresh Token). Sessões expirando antes do tempo configurado devido a dessincronização de relógio entre cliente e servidor.
- **Crítico**: Vazamento de chaves secretas (JWT_SECRET), falha total na validação de tokens permitindo acesso não autorizado ou bloqueio total de login para usuários legítimos devido a erro no serviço de autenticação.

---

## 2. Controle de Acesso Baseado em Perfis (RBAC)
*Dependência: Média (Depende de Autenticação Ativa)*

Garantir que as permissões (ADMIN, MANAGER, SUPERVISOR, etc.) sejam respeitadas em todas as operações de CRUD.

- **Normal**: Usuários visualizam e editam apenas o que é permitido para seu perfil. O sistema bloqueia ações não autorizadas com mensagens claras e logs de segurança.
- **Atenção**: Inconsistências onde um perfil tem acesso a uma funcionalidade na interface (UI), mas a API bloqueia a ação (ou vice-versa). Perfis com permissões excessivas por erro de configuração.
- **Crítico**: Falha no middleware de autorização que permite a um perfil `WORKER` ou `CLIENT` realizar ações de `ADMIN` (ex: excluir projetos ou alterar dados financeiros), comprometendo a integridade dos dados.

---

## 3. Gestão de Tarefas (Tasks e Sub-tarefas)
*Dependência: Média (Depende de Projetos e Autenticação)*

Implementação completa das funcionalidades de criação, atribuição e acompanhamento de tarefas vinculadas aos projetos.

- **Normal**: Tarefas são criadas, atribuídas a trabalhadores e atualizadas em tempo real. O progresso das tarefas reflete corretamente no status geral do projeto.
- **Atenção**: Atrasos na atualização visual do status das tarefas. Falhas ao anexar comentários ou sub-tarefas que não impedem a visualização da tarefa principal.
- **Crítico**: Perda de vínculo entre tarefas e projetos (órfãos), impossibilidade de concluir tarefas devido a erros de banco de dados ou falha na atribuição de responsáveis impedindo o fluxo de trabalho.

---

## 4. Auditoria e Logs de Atividade (Activity Logs)
*Dependência: Alta (Depende de todas as entidades e Autenticação)*

Rastreabilidade de quem realizou qual alteração em qual momento em todo o sistema.

- **Normal**: Cada ação relevante (criação, edição, exclusão) é registrada silenciosamente no banco de dados com IP, usuário e detalhes das mudanças (JSON).
- **Atenção**: Atraso no registro de logs ou crescimento excessivo da tabela de auditoria impactando a performance geral do banco de dados. Logs com informações incompletas sobre o autor da mudança.
- **Crítico**: Falha total no sistema de logs, impossibilitando a investigação de alterações indevidas ou corrupção dos registros de auditoria, ferindo requisitos de conformidade e segurança.

---

## 5. Relatórios e Exportação de Dados (PDF/Excel)
*Dependência: Alta (Depende de Massa de Dados e Estabilidade de Todos os Módulos)*

Geração de relatórios consolidados para diretoria e clientes.

- **Normal**: Exportação rápida e precisa de relatórios de progresso, mão de obra e materiais em formatos portáteis (PDF) e editáveis (Excel).
- **Atenção**: Formatação inconsistente em relatórios muito extensos ou demora excessiva no processamento de grandes volumes de dados.
- **Crítico**: Geração de relatórios com dados divergentes da base de dados real ou falha total do serviço de geração de arquivos (ex: erro de memória no servidor), impedindo a prestação de contas.
