# Guia Completo de Instalação e Configuração
## National Group India - Construction Management System

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação Passo a Passo](#instalação-passo-a-passo)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
6. [Inicialização do Aplicativo](#inicialização-do-aplicativo)
7. [Verificação da Instalação](#verificação-da-instalação)
8. [Configurações Avançadas](#configurações-avançadas)
9. [Deploy em Produção](#deploy-em-produção)
10. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral do Sistema

O **National Group India Construction Management System** é uma aplicação full-stack para gerenciamento de obras de construção, composta por:

- **Frontend**: SvelteKit + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Banco de Dados**: 
  - SQLite (desenvolvimento local)
  - PostgreSQL (produção com Prisma ORM)
- **Deploy**: Netlify (serverless functions)

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (SvelteKit)                     │
│                  http://localhost:5174                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP/REST API
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 BACKEND (Express.js)                        │
│                  http://localhost:3001                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐         ┌────────▼─────────┐
│  SQLite (Dev)  │         │ PostgreSQL (Prod)│
│  construction  │         │  Prisma ORM      │
│     .db        │         │                  │
└────────────────┘         └──────────────────┘
```

---

## 💻 Pré-requisitos

### Software Obrigatório

#### 1. Node.js (v20.0.0 ou superior)

**Verificar instalação:**
```bash
node --version
```

**Instalação:**

- **Windows**: Baixe o instalador em [nodejs.org](https://nodejs.org/)
- **macOS**: 
  ```bash
  brew install node@20
  ```
- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

#### 2. npm (v9.0.0 ou superior)

Geralmente instalado junto com Node.js. Verificar:
```bash
npm --version
```

#### 3. Git

**Verificar instalação:**
```bash
git --version
```

**Instalação:**
- **Windows**: [git-scm.com](https://git-scm.com/)
- **macOS**: `brew install git`
- **Linux**: `sudo apt-get install git`

### Software Opcional (Recomendado)

#### 4. PostgreSQL (v14 ou superior) - Para Produção

**Verificar instalação:**
```bash
psql --version
```

**Instalação:**

- **Windows**: Baixe em [postgresql.org](https://www.postgresql.org/download/)
- **macOS**: 
  ```bash
  brew install postgresql@14
  brew services start postgresql@14
  ```
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt-get update
  sudo apt-get install postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  ```

#### 5. Redis (Opcional - Para cache)

**Instalação:**
- **macOS**: `brew install redis`
- **Linux**: `sudo apt-get install redis-server`
- **Windows**: Use WSL ou Docker

### Ferramentas de Desenvolvimento (Opcional)

- **VS Code** com extensões:
  - Svelte for VS Code
  - Prisma
  - ESLint
  - TypeScript
- **Postman** ou **Insomnia** (para testar APIs)
- **DBeaver** ou **pgAdmin** (para gerenciar banco de dados)

### Requisitos de Hardware

**Mínimo:**
- CPU: 2 cores
- RAM: 4 GB
- Disco: 2 GB livres

**Recomendado:**
- CPU: 4+ cores
- RAM: 8+ GB
- Disco: 5+ GB livres
- SSD para melhor performance

---

## 🚀 Instalação Passo a Passo

### Passo 1: Clonar o Repositório

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório do projeto
cd national-group-construction

# Verifique se está no diretório correto
pwd
ls -la
```

### Passo 2: Instalar Dependências

```bash
# Instalar todas as dependências do projeto
npm install

# Aguarde a conclusão (pode levar 2-5 minutos)
```

**O que está sendo instalado:**

**Dependências de Produção:**
- `@prisma/client` - ORM para banco de dados
- `express` - Framework web
- `bcryptjs` - Hash de senhas
- `jsonwebtoken` - Autenticação JWT
- `cors` - Cross-Origin Resource Sharing
- `helmet` - Segurança HTTP
- `winston` - Sistema de logs
- `zod` - Validação de schemas

**Dependências de Desenvolvimento:**
- `@sveltejs/kit` - Framework frontend
- `svelte` - Framework reativo
- `vite` - Build tool
- `typescript` - Tipagem estática
- `concurrently` - Executar múltiplos comandos

### Passo 3: Verificar Instalação

```bash
# Verificar se node_modules foi criado
ls -la node_modules

# Verificar scripts disponíveis
npm run
```

---

## ⚙️ Configuração do Ambiente

### Passo 1: Criar Arquivo de Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Ou criar manualmente
touch .env
```

### Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env` com as seguintes configurações:

#### Configuração para Desenvolvimento Local (SQLite)

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados SQLite (Desenvolvimento)
DATABASE_URL="file:./server/database/construction.db"

# Segurança
JWT_SECRET=national_group_construction_secret_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS - Origens permitidas
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug

# Sentry (Opcional - para monitoramento de erros)
SENTRY_DSN=

# Redis (Opcional - para cache)
REDIS_URL=redis://localhost:6379
```

#### Configuração para Produção (PostgreSQL)

```env
# Servidor
PORT=3001
NODE_ENV=production

# Banco de Dados PostgreSQL (Produção)
DATABASE_URL="postgresql://username:password@localhost:5432/construction_db?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/construction_db?schema=public"

# Segurança - IMPORTANTE: Gere chaves seguras!
JWT_SECRET=<GERAR_CHAVE_SEGURA_MINIMO_32_CARACTERES>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS - Adicione seus domínios de produção
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com

# Rate Limiting (mais restritivo em produção)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Logging
LOG_LEVEL=info

# Sentry (Recomendado para produção)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Redis (Recomendado para produção)
REDIS_URL=redis://localhost:6379
```

### Passo 3: Gerar Chaves Seguras

#### Gerar JWT_SECRET

```bash
# Opção 1: Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opção 2: Usando OpenSSL
openssl rand -hex 32

# Opção 3: Usando pwgen (Linux)
pwgen -s 64 1
```

Copie a chave gerada e cole no arquivo `.env`:
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Passo 4: Configurar Permissões de Arquivos

```bash
# Linux/macOS - Proteger arquivo .env
chmod 600 .env

# Verificar permissões
ls -la .env
# Deve mostrar: -rw------- (somente proprietário pode ler/escrever)
```

**Windows:**
```powershell
# Remover herança de permissões
icacls .env /inheritance:r

# Dar permissão apenas ao usuário atual
icacls .env /grant:r "%USERNAME%:F"
```

---

## 🗄️ Configuração do Banco de Dados

O projeto suporta dois bancos de dados:
- **SQLite**: Para desenvolvimento local (mais simples)
- **PostgreSQL**: Para produção (mais robusto)

### Opção A: SQLite (Desenvolvimento - Recomendado para Início)

#### Vantagens:
- ✅ Sem instalação adicional
- ✅ Configuração zero
- ✅ Arquivo único
- ✅ Ideal para desenvolvimento

#### Configuração:

```bash
# O banco de dados SQLite será criado automaticamente
# Localização: server/database/construction.db

# Criar diretório se não existir
mkdir -p server/database

# Verificar se o diretório foi criado
ls -la server/database
```

**Arquivo `.env`:**
```env
DATABASE_URL="file:./server/database/construction.db"
```

#### Inicializar Banco de Dados SQLite:

O banco será inicializado automaticamente na primeira execução do servidor. As tabelas criadas:

1. **status_board** - Quadro de status de projetos
2. **construction_phases** - Fases de construção
3. **labor** - Gestão de mão de obra
4. **materials** - Inventário de materiais
5. **plant_machinery** - Equipamentos e maquinário
6. **daily_updates** - Atualizações diárias

### Opção B: PostgreSQL (Produção)

#### Vantagens:
- ✅ Melhor performance
- ✅ Suporte a múltiplos usuários
- ✅ Recursos avançados
- ✅ Escalabilidade

#### Passo 1: Criar Banco de Dados PostgreSQL

```bash
# Conectar ao PostgreSQL como superusuário
sudo -u postgres psql

# Ou no Windows/macOS:
psql -U postgres
```

**No console do PostgreSQL:**
```sql
-- Criar usuário
CREATE USER construction_admin WITH PASSWORD 'senha_segura_aqui';

-- Criar banco de dados
CREATE DATABASE construction_db OWNER construction_admin;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE construction_db TO construction_admin;

-- Sair
\q
```

#### Passo 2: Configurar DATABASE_URL

Edite o arquivo `.env`:
```env
DATABASE_URL="postgresql://construction_admin:senha_segura_aqui@localhost:5432/construction_db?schema=public"
DIRECT_URL="postgresql://construction_admin:senha_segura_aqui@localhost:5432/construction_db?schema=public"
```

**Formato da URL:**
```
postgresql://[usuario]:[senha]@[host]:[porta]/[database]?schema=public
```

#### Passo 3: Executar Migrações do Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar migrações
npx prisma migrate dev --name init

# Verificar status das migrações
npx prisma migrate status
```

#### Passo 4: (Opcional) Popular Banco com Dados de Teste

```bash
# Se houver arquivo de seed
npx prisma db seed
```

#### Passo 5: Verificar Conexão

```bash
# Abrir Prisma Studio (interface visual)
npx prisma studio

# Acesse: http://localhost:5555
```

### Backup e Restauração

#### SQLite:

**Backup:**
```bash
# Copiar arquivo do banco
cp server/database/construction.db server/database/construction.db.backup

# Ou com timestamp
cp server/database/construction.db "server/database/construction.db.$(date +%Y%m%d_%H%M%S).backup"
```

**Restauração:**
```bash
cp server/database/construction.db.backup server/database/construction.db
```

#### PostgreSQL:

**Backup:**
```bash
# Backup completo
pg_dump -U construction_admin -d construction_db -F c -f backup_$(date +%Y%m%d).dump

# Backup em SQL
pg_dump -U construction_admin -d construction_db > backup_$(date +%Y%m%d).sql
```

**Restauração:**
```bash
# Restaurar de dump
pg_restore -U construction_admin -d construction_db backup_20250101.dump

# Restaurar de SQL
psql -U construction_admin -d construction_db < backup_20250101.sql
```

---

## 🎬 Inicialização do Aplicativo

### Modo 1: Desenvolvimento Completo (Frontend + Backend)

```bash
# Iniciar ambos os servidores simultaneamente
npm run dev:all
```

**O que acontece:**
- ✅ Backend inicia na porta 3001
- ✅ Frontend inicia na porta 5174
- ✅ Hot reload ativado em ambos
- ✅ Logs de ambos os servidores no mesmo terminal

**Saída esperada:**
```
[0] 🏗️  National Group India Construction Server running on port 3001
[0] 📊 API Health: http://localhost:3001/api/health
[0] Server is ready to accept connections...
[1] 
[1]   VITE v7.0.4  ready in 1234 ms
[1] 
[1]   ➜  Local:   http://localhost:5174/
[1]   ➜  Network: use --host to expose
```

### Modo 2: Servidores Separados (Recomendado para Debug)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Modo 3: Produção

```bash
# Build do projeto
npm run build

# Iniciar servidor de produção
npm start

# Ou preview do build
npm run preview
```

### Comandos Úteis Durante Desenvolvimento

```bash
# Type checking (verificar erros TypeScript)
npm run check

# Type checking em modo watch
npm run check:watch

# Build apenas do servidor
npm run build:server
```

---

## ✅ Verificação da Instalação

### Checklist de Verificação

#### 1. Verificar Backend

```bash
# Teste de saúde da API
curl http://localhost:3001/api/health

# Ou no navegador:
# http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "National Group India Construction API"
}
```

#### 2. Verificar Endpoints da API

```bash
# Status Board
curl http://localhost:3001/api/status

# Labor Management
curl http://localhost:3001/api/labor

# Materials
curl http://localhost:3001/api/materials

# Daily Updates
curl http://localhost:3001/api/daily-updates
```

**Resposta esperada:** Array vazio `[]` ou dados se já houver registros.

#### 3. Verificar Frontend

Abra o navegador em: **http://localhost:5174**

**Verificações:**
- ✅ Página carrega sem erros
- ✅ Dashboard é exibido
- ✅ Navegação funciona
- ✅ Sem erros no console do navegador (F12)

#### 4. Verificar Banco de Dados

**SQLite:**
```bash
# Verificar se arquivo foi criado
ls -lh server/database/construction.db

# Abrir banco com sqlite3
sqlite3 server/database/construction.db

# No console SQLite:
.tables
.schema status_board
.quit
```

**PostgreSQL:**
```bash
# Conectar ao banco
psql -U construction_admin -d construction_db

# Listar tabelas
\dt

# Descrever tabela
\d users

# Sair
\q
```

#### 5. Verificar Logs

**Backend logs:**
```bash
# Logs devem aparecer no terminal onde o servidor está rodando
# Procure por:
# - "Server running on port 3001"
# - "Connected to SQLite database" ou "Prisma connected"
# - Sem mensagens de erro
```

**Frontend logs:**
```bash
# No navegador, abra DevTools (F12)
# Console deve estar limpo, sem erros vermelhos
```

#### 6. Teste de Integração Completo

**Criar um registro de teste:**

```bash
# POST para criar status
curl -X POST http://localhost:3001/api/status \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Teste de Instalação",
    "phase": "CONSTRUCTION",
    "status": "IN_PROGRESS",
    "progress": 50,
    "start_date": "2025-01-01",
    "end_date": "2025-12-31"
  }'

# GET para verificar
curl http://localhost:3001/api/status
```

**No Frontend:**
1. Acesse http://localhost:5174
2. Navegue até "Status Board"
3. Verifique se o registro "Teste de Instalação" aparece
4. Tente editar o progresso
5. Verifique se a atualização funciona

### Testes Automatizados (Se disponíveis)

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
npm run test:coverage

# Executar testes E2E
npm run test:e2e
```

---

## 🔧 Configurações Avançadas

### 1. Configurar CORS para Múltiplos Domínios

Edite `server/middleware/security.middleware.ts`:

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://seu-dominio.com',
      'https://www.seu-dominio.com'
    ];
```

### 2. Configurar Rate Limiting

Ajuste no `.env`:
```env
# Janela de tempo em milissegundos (15 minutos)
RATE_LIMIT_WINDOW_MS=900000

# Máximo de requisições por janela
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Configurar Logging com Winston

Edite `server/utils/logger.ts` para ajustar níveis de log:

```typescript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

**Criar diretório de logs:**
```bash
mkdir -p logs
chmod 755 logs
```

### 4. Configurar Sentry para Monitoramento

**Instalar SDK (já incluído):**
```bash
npm install @sentry/node @sentry/profiling-node
```

**Configurar no `.env`:**
```env
SENTRY_DSN=https://your-key@sentry.io/project-id
```

**Inicializar no `server/index.js`:**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 5. Configurar Redis para Cache

**Instalar cliente Redis:**
```bash
npm install redis
```

**Criar `server/utils/redis.ts`:**
```typescript
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

await redisClient.connect();

export default redisClient;
```

### 6. Configurar SSL/HTTPS (Produção)

**Opção 1: Nginx como Reverse Proxy**

```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5174;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Opção 2: Let's Encrypt com Certbot**

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo certbot renew --dry-run
```

### 7. Configurar Variáveis de Ambiente por Ambiente

**Criar múltiplos arquivos .env:**

```bash
.env.development
.env.staging
.env.production
```

**Usar com dotenv:**
```bash
# Desenvolvimento
NODE_ENV=development node -r dotenv/config server/index.js dotenv_config_path=.env.development

# Produção
NODE_ENV=production node -r dotenv/config server/index.js dotenv_config_path=.env.production
```

### 8. Configurar PM2 para Gerenciamento de Processos

**Instalar PM2:**
```bash
npm install -g pm2
```

**Criar `ecosystem.config.js`:**
```javascript
module.exports = {
  apps: [{
    name: 'construction-api',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
  }]
};
```

**Comandos PM2:**
```bash
# Iniciar
pm2 start ecosystem.config.js

# Status
pm2 status

# Logs
pm2 logs

# Restart
pm2 restart construction-api

# Stop
pm2 stop construction-api

# Startup script (iniciar com o sistema)
pm2 startup
pm2 save
```

---

## 🚀 Deploy em Produção

### Opção 1: Deploy no Netlify (Recomendado)

#### Pré-requisitos:
- Conta no [Netlify](https://www.netlify.com/)
- Repositório Git (GitHub, GitLab, Bitbucket)

#### Passo 1: Preparar Projeto

```bash
# Verificar se netlify.toml existe
cat netlify.toml

# Build local para testar
npm run build
```

#### Passo 2: Configurar Netlify

**Via Netlify CLI:**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

**Via Interface Web:**
1. Acesse [app.netlify.com](https://app.netlify.com/)
2. Clique em "Add new site" → "Import an existing project"
3. Conecte seu repositório Git
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Functions directory**: `netlify/functions`

#### Passo 3: Configurar Variáveis de Ambiente no Netlify

1. Vá em **Site settings** → **Environment variables**
2. Adicione todas as variáveis do `.env`:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   JWT_SECRET=...
   ALLOWED_ORIGINS=https://seu-site.netlify.app
   ```

#### Passo 4: Configurar Banco de Dados

**Opções:**
- **Neon** (PostgreSQL serverless): [neon.tech](https://neon.tech/)
- **Supabase**: [supabase.com](https://supabase.com/)
- **PlanetScale**: [planetscale.com](https://planetscale.com/)
- **Railway**: [railway.app](https://railway.app/)

**Exemplo com Neon:**
```bash
# Criar projeto no Neon
# Copiar connection string
# Adicionar no Netlify como DATABASE_URL
```

#### Passo 5: Deploy

```bash
# Push para Git
git add .
git commit -m "Deploy to production"
git push origin main

# Netlify fará deploy automaticamente
```

### Opção 2: Deploy em VPS (DigitalOcean, AWS, etc.)

#### Passo 1: Provisionar Servidor

**Requisitos mínimos:**
- Ubuntu 22.04 LTS
- 2 GB RAM
- 2 vCPUs
- 50 GB SSD

#### Passo 2: Configurar Servidor

```bash
# Conectar via SSH
ssh root@seu-servidor-ip

# Atualizar sistema
sudo apt-get update
sudo apt-get upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Instalar Nginx
sudo apt-get install nginx

# Instalar PM2
npm install -g pm2

# Instalar Git
sudo apt-get install git
```

#### Passo 3: Clonar e Configurar Projeto

```bash
# Criar usuário para aplicação
sudo adduser construction
sudo usermod -aG sudo construction
su - construction

# Clonar repositório
git clone <URL_DO_REPOSITORIO>
cd national-group-construction

# Instalar dependências
npm install

# Criar .env
nano .env
# (Colar configurações de produção)

# Build
npm run build
```

#### Passo 4: Configurar PostgreSQL

```bash
# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE construction_db;
CREATE USER construction_admin WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE construction_db TO construction_admin;
\q

# Executar migrações
npx prisma migrate deploy
```

#### Passo 5: Configurar PM2

```bash
# Iniciar aplicação
pm2 start ecosystem.config.js

# Configurar startup
pm2 startup
pm2 save

# Verificar status
pm2 status
pm2 logs
```

#### Passo 6: Configurar Nginx

```bash
# Criar configuração
sudo nano /etc/nginx/sites-available/construction

# Colar configuração:
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:5174;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/construction /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### Passo 7: Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Testar renovação automática
sudo certbot renew --dry-run
```

#### Passo 8: Configurar Firewall

```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar status
sudo ufw status
```

### Opção 3: Deploy com Docker

#### Criar `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3001 5174

CMD ["npm", "start"]
```

#### Criar `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
      - "5174:5174"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=construction_db
      - POSTGRES_USER=construction_admin
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy:

```bash
# Build
docker-compose build

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## 🔍 Solução de Problemas

### Problema 1: Erro "Cannot find module"

**Sintoma:**
```
Error: Cannot find module 'express'
```

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problema 2: Porta já em uso

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solução:**

**Linux/macOS:**
```bash
# Encontrar processo usando a porta
lsof -i :3001

# Matar processo
kill -9 <PID>

# Ou mudar porta no .env
PORT=3002
```

**Windows:**
```powershell
# Encontrar processo
netstat -ano | findstr :3001

# Matar processo
taskkill /PID <PID> /F
```

### Problema 3: Erro de conexão com banco de dados

**Sintoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução:**

**PostgreSQL:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Iniciar se necessário
sudo systemctl start postgresql

# Verificar conexão
psql -U construction_admin -d construction_db -h localhost
```

**SQLite:**
```bash
# Verificar permissões do diretório
ls -la server/database/

# Dar permissões se necessário
chmod 755 server/database
chmod 644 server/database/construction.db
```

### Problema 4: Erro de CORS

**Sintoma:**
```
Access to fetch at 'http://localhost:3001/api/status' from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Solução:**

Verificar `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

Ou editar `server/middleware/security.middleware.ts`:
```typescript
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

### Problema 5: Erro de JWT

**Sintoma:**
```
JsonWebTokenError: invalid signature
```

**Solução:**
```bash
# Gerar novo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Atualizar .env
JWT_SECRET=<nova_chave>

# Limpar tokens antigos do banco
# Usuários precisarão fazer login novamente
```

### Problema 6: Build falha

**Sintoma:**
```
Error: Build failed with errors
```

**Solução:**
```bash
# Verificar erros TypeScript
npm run check

# Limpar cache do Vite
rm -rf .svelte-kit
rm -rf build

# Rebuild
npm run build
```

### Problema 7: Prisma não gera cliente

**Sintoma:**
```
Error: @prisma/client did not initialize yet
```

**Solução:**
```bash
# Gerar cliente Prisma
npx prisma generate

# Verificar schema
npx prisma validate

# Resetar banco (CUIDADO: apaga dados)
npx prisma migrate reset
```

### Problema 8: Permissões negadas

**Sintoma:**
```
EACCES: permission denied
```

**Solução:**
```bash
# Dar permissões ao diretório
sudo chown -R $USER:$USER .

# Ou executar com sudo (não recomendado)
sudo npm install
```

### Problema 9: Memória insuficiente

**Sintoma:**
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solução:**
```bash
# Aumentar limite de memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Ou no package.json:
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
}
```

### Problema 10: Frontend não conecta ao backend

**Sintoma:**
- Frontend carrega mas não mostra dados
- Erros de rede no console

**Solução:**

Verificar `src/lib/config.js`:
```javascript
const API_BASE = import.meta.env.PROD
  ? '/api'  // Produção
  : 'http://localhost:3001/api';  // Desenvolvimento

export { API_BASE };
```

Verificar se backend está rodando:
```bash
curl http://localhost:3001/api/health
```

### Logs e Debugging

**Ativar logs detalhados:**
```env
LOG_LEVEL=debug
NODE_ENV=development
```

**Ver logs do PM2:**
```bash
pm2 logs construction-api --lines 100
```

**Ver logs do Nginx:**
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

**Ver logs do PostgreSQL:**
```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **SvelteKit**: https://kit.svelte.dev/docs
- **Prisma**: https://www.prisma.io/docs
- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Netlify**: https://docs.netlify.com/

### Comunidade e Suporte

- **Stack Overflow**: Tag `sveltekit`, `prisma`, `express`
- **Discord**: Svelte Discord Server
- **GitHub Issues**: Reportar bugs no repositório

### Ferramentas Úteis

- **Prisma Studio**: Interface visual para banco de dados
  ```bash
  npx prisma studio
  ```

- **Postman Collection**: Importar endpoints da API
- **VS Code Extensions**:
  - Svelte for VS Code
  - Prisma
  - ESLint
  - Prettier

### Monitoramento e Analytics

- **Sentry**: Monitoramento de erros
- **LogRocket**: Session replay
- **Google Analytics**: Analytics de uso
- **Uptime Robot**: Monitoramento de uptime

---

## 🎓 Próximos Passos

Após a instalação bem-sucedida:

1. **Explorar a aplicação**
   - Navegar por todos os módulos
   - Criar dados de teste
   - Testar todas as funcionalidades

2. **Personalizar**
   - Ajustar cores e tema
   - Adicionar logo da empresa
   - Customizar campos conforme necessidade

3. **Configurar backups automáticos**
   - Configurar cron jobs para backup
   - Testar restauração

4. **Implementar CI/CD**
   - GitHub Actions
   - GitLab CI
   - Jenkins

5. **Adicionar testes**
   - Testes unitários
   - Testes de integração
   - Testes E2E

6. **Documentar processos**
   - Fluxos de trabalho
   - Procedimentos operacionais
   - Guia do usuário

---

## 📞 Suporte

Para suporte adicional:

- **Email**: support@nationalgroupindia.com
- **Documentação**: Consulte este guia
- **Issues**: Abra uma issue no repositório Git

---

**Última atualização**: Janeiro 2025  
**Versão do guia**: 1.0.0  
**Compatível com**: Node.js 20+, PostgreSQL 14+, SQLite 3+

---

**Built with ❤️ for National Group India Construction Team**
