# Sentinela360 - Backend

Backend da plataforma Sentinela360 desenvolvido com NestJS e TypeScript.

## O que é o Sentinela360

Sentinela360 é uma plataforma de gestão de reputação, feedbacks e relacionamento entre clientes e empresas. O sistema possui duas visões principais:

- **Cliente (Consumer)**: Interface para clientes criarem feedbacks e acompanharem respostas das empresas
- **Empresa (Company)**: Dashboard para empresas gerenciarem reputação, equipe, permissões, respostas, insights e assinaturas

O produto inicia como um MVP com foco em baixo custo, mas preparado para escalar.

## Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ 
- Yarn ou npm
- PostgreSQL 14+

### Instalação

```bash
yarn install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Aplicação
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/sentinela360

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Webhooks (quando aplicável)
WEBHOOK_SECRET=your-webhook-secret
```

### Execução

```bash
# Desenvolvimento
yarn start:dev

# Produção
yarn build
yarn start:prod
```

A aplicação estará disponível em `http://localhost:3000`.

## Documentação Arquitetural

Para entender a arquitetura, padrões, decisões técnicas e estrutura do backend, consulte o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md).
