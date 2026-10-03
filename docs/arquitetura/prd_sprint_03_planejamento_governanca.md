# PRD - Sprint 03 - Planejamento Colaborativo e Governança

## Objetivo

Ativar o domínio já modelado de projetos, tarefas, comentários e auditoria, fechando o ciclo entre planejamento, execução e prestação de contas.

## Problema

O schema já descreve um sistema mais maduro de colaboração, mas ele ainda não está entregue de forma coerente para o usuário final. Isso cria expectativa arquitetural sem benefício real de negócio.

## Usuários impactados

- `ADMIN`
- `MANAGER`
- `SUPERVISOR`
- `WORKER`
- `CLIENT` em modo consulta
- diretoria e auditoria

## Metas

1. Tornar `Project` a raiz visível de governança.
2. Entregar gestão de tarefas com responsáveis, subtarefas e comentários.
3. Implementar auditoria transversal.
4. Disponibilizar relatórios executivos confiáveis.

## Requisitos funcionais

1. Criar, editar e consultar projetos com orçamento, cliente, local e status.
2. Adicionar membros de projeto com papéis específicos.
3. Criar tarefas e subtarefas vinculadas ao projeto.
4. Atribuir usuários a tarefas.
5. Permitir comentários por tarefa.
6. Registrar `ActivityLog` para ações críticas.
7. Gerar relatórios por projeto, período, produtividade, custo e risco.

## Requisitos não funcionais

1. Auditoria deve guardar metadados suficientes para investigação.
2. Relatórios devem usar fonte única de verdade.
3. Permissões devem considerar projeto, papel global e ação.
4. Modelo deve suportar crescimento sem duplicação semântica entre `Project` e `StatusBoard`.

## Escopo

- ativação de `Project`, `ProjectMember`, `Task`, `TaskAssignment`, `Comment`, `ActivityLog`;
- relatórios gerenciais;
- integração com módulos operacionais.

## Fora de escopo

- BI avançado externo;
- IA generativa;
- integração ERP financeira completa.

## Critérios de aceite

1. Projeto deve ser entidade mestre para operação, tarefas e relatórios.
2. Toda tarefa deve pertencer a um projeto e ter histórico auditável.
3. Comentários devem possuir autoria e carimbo temporal.
4. `ActivityLog` deve registrar no mínimo CRUD de projeto, tarefa e status.
5. Relatórios devem reconciliar planejamento, execução e recursos.

## Dependências

- sprint 01 para segurança e contratos;
- sprint 02 para normalização do domínio operacional;
- decisão de catálogo de status e fases.

## Riscos

- aumento significativo de escopo de produto;
- necessidade de replanejamento do front principal;
- possibilidade de sobreposição funcional entre `StatusBoard` e `Project`.

## Métricas de sucesso

- projetos com membros e tarefas funcionando ponta a ponta;
- 100% das mutações críticas registradas em `ActivityLog`;
- relatórios executivos consistentes com a base operacional;
- redução do retrabalho manual de acompanhamento por planilhas externas.
