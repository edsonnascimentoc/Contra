# PRD - Sprint 01 - Fundação Técnica e Segurança

## Objetivo

Consolidar a base técnica para que autenticação, autorização, contratos de API e telemetria deixem de ser pontos frágeis e passem a sustentar a evolução dos módulos de negócio.

## Problema

Hoje a aplicação possui autenticação funcional, mas ainda com exposições e inconsistências:

- tokens são persistidos em `localStorage`;
- parte do frontend chama endpoints protegidos sem usar o cliente autenticado;
- enums e contratos estão inconsistentes entre backend, frontend e documentação;
- observabilidade e auditoria estão incompletas.

## Usuários impactados

- `ADMIN`
- `MANAGER`
- `SUPERVISOR`
- `WORKER`
- `CLIENT`
- equipe técnica de manutenção e suporte

## Metas

1. Garantir sessão segura e previsível.
2. Padronizar contratos de API e enums.
3. Eliminar chamadas protegidas sem autenticação correta.
4. Preparar observabilidade e auditoria transversal.

## Requisitos funcionais

1. Login deve retornar sessão válida com renovação controlada.
2. Logout deve invalidar refresh token de forma consistente.
3. Todas as mutações protegidas devem usar cliente HTTP autenticado.
4. Perfis devem ter matriz de RBAC explícita por módulo e ação.
5. Eventos críticos devem gerar trilha de auditoria.

## Requisitos não funcionais

1. Sessão deve priorizar cookie `httpOnly` para refresh token.
2. JWT secret não pode ter fallback inseguro em produção.
3. Logs e tracing devem ser configuráveis por ambiente.
4. APIs devem ter payload validado no backend.

## Escopo

- autenticação e refresh;
- RBAC;
- padronização de enums;
- validações Zod para módulos operacionais;
- integração inicial com `ActivityLog`;
- revisão de README e contratos.

## Fora de escopo

- construção completa de relatórios;
- implementação integral de tarefas e comentários;
- redesign visual amplo.

## Critérios de aceite

1. Nenhuma operação protegida do frontend deve usar `fetch` cru sem token.
2. Refresh token deve sair de `localStorage`.
3. Todos os módulos operacionais devem possuir validação backend mínima.
4. README deve refletir apenas endpoints e entidades reais.
5. Pelo menos criação, edição e exclusão de dados críticos devem gerar `ActivityLog`.

## Dependências

- schema Prisma consolidado;
- política de ambiente para segredos;
- definição oficial de enums de fase e status.

## Riscos

- alteração de sessão pode exigir ajustes de infraestrutura e CORS;
- auditoria pode aumentar custo de escrita e volume de banco;
- correções de contrato podem impactar testes existentes.

## Métricas de sucesso

- zero chamadas protegidas sem autenticação no frontend;
- zero divergências conhecidas entre README e rotas reais;
- cobertura de validação backend em 100% dos endpoints de escrita;
- queda de erros 401/403 indevidos em fluxos operacionais.
