# PRD - Sprint 02 - Operação de Obra

## Objetivo

Transformar os módulos operacionais já iniciados em uma suíte coesa para acompanhamento diário da obra.

## Problema

O sistema já possui o núcleo operacional modelado, mas a maturidade é desigual:

- `StatusBoard` está mais robusto;
- `Labor` funciona, porém com fragilidades de integração;
- `Material` e `DailyUpdate` têm API parcial e telas ainda incompletas;
- os módulos ainda não se conectam formalmente a um projeto raiz.

## Usuários impactados

- `ADMIN`
- `MANAGER`
- `SUPERVISOR`
- `WORKER`
- `CLIENT` em consultas permitidas

## Metas

1. Entregar jornada operacional ponta a ponta.
2. Vincular dados operacionais ao projeto correto.
3. Melhorar integridade, busca e consistência de métricas.

## Requisitos funcionais

1. Cadastrar e atualizar `StatusBoard` por projeto e fase.
2. Registrar histórico de alteração de prazo.
3. Cadastrar, editar, filtrar e inativar mão de obra.
4. Cadastrar, editar, filtrar e acompanhar materiais.
5. Registrar atualizações diárias com autor, data, clima, produção, issues e evidências.
6. Exibir dashboard com estatísticas consolidadas.

## Requisitos não funcionais

1. Todas as entidades operacionais devem ter relacionamento formal com `Project`.
2. Status e fases devem vir de catálogo controlado.
3. Custos devem usar política monetária consistente.
4. Dashboard deve responder com filtros por período sem ambiguidade semântica.

## Escopo

- refinamento de `StatusBoard`, `DateHistory`, `Labor`, `Material`, `DailyUpdate`;
- implementação real das telas de materiais e diário;
- consolidação de estatísticas do dashboard.

## Fora de escopo

- colaboração completa por tarefas;
- exportação avançada PDF/Excel;
- analytics preditivo.

## Critérios de aceite

1. `Labor`, `Material` e `DailyUpdate` devem operar com UX funcional completa.
2. Todos os cadastros operacionais devem apontar para um `Project`.
3. Catálogos de fase e status devem ser compartilhados entre backend e frontend.
4. `DailyUpdate.createdBy` deve ser substituído por FK válida.
5. Métricas do dashboard devem ser derivadas de dados normalizados.

## Dependências

- sprint 01 concluída para segurança, contratos e validações;
- decisão de modelo canônico entre `Project` e `StatusBoard`.

## Riscos

- migração de dados para incluir `projectId`;
- necessidade de revisão de mock, seed e testes;
- impacto em filtros e dashboards existentes.

## Métricas de sucesso

- 100% dos módulos operacionais com UI funcional;
- 100% das entidades operacionais vinculadas a projeto;
- redução de inconsistência entre status exibido e status persistido;
- dashboard refletindo dados do dia sem ajustes manuais.
