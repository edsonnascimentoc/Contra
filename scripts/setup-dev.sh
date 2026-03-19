#!/bin/bash

# Script para desenvolvimento local com SQLite

echo "🔄 Configurando ambiente de desenvolvimento..."

# Copiar schema de desenvolvimento
cp prisma/schema.dev.prisma prisma/schema.prisma

# Gerar Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# Criar banco de dados SQLite se não existir
if [ ! -f "dev.db" ]; then
    echo "🗄️  Criando banco de dados SQLite..."
    npx prisma db push
fi

echo "✅ Configuração de desenvolvimento concluída!"
echo "🚀 Inicie o servidor com: npm run dev:all"