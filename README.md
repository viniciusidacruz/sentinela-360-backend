# Sentinela360 - Backend

Backend da plataforma Sentinela360 desenvolvido com NestJS e TypeScript.

## O que é o Sentinela360

Sentinela360 é uma plataforma de gestão de reputação, feedbacks e relacionamento entre clientes e empresas. O sistema possui duas visões principais:

- **Cliente (Consumer)**: Interface para clientes criarem feedbacks e acompanharem respostas das empresas
- **Empresa (Company)**: Dashboard para empresas gerenciarem reputação, equipe, permissões, respostas, insights e assinaturas

O produto inicia como um MVP com foco em baixo custo, mas preparado para escalar.

## Como Rodar o Projeto

### Pré-requisitos

- Node.js 25.2.1+ (versão específica definida em `.nvmrc`)
- Yarn 1.22.22+ (obrigatório - o projeto valida o uso do Yarn)
- PostgreSQL 14+

### Instalação

1. Habilite o Corepack (necessário para usar Yarn):

```bash
corepack enable
```

2. Instale as dependências:

```bash
yarn install
```

O projeto possui um script `preinstall` que valida o uso do Yarn. Tentativas de instalação com npm serão bloqueadas.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Aplicação
PORT=3000
NODE_ENV=development

# CORS (origens permitidas separadas por vírgula)
# Em produção, defina as origens específicas do frontend
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

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

### Documentação da API (Swagger)

Em ambiente de desenvolvimento, a documentação interativa da API está disponível em:

```
http://localhost:3333/api/docs
```

O Swagger permite explorar todos os endpoints, testar requisições e visualizar os modelos de dados da API.

## Regras de Negócio

### Estrutura de Endpoints

A API segue padrões REST e divide endpoints em duas áreas:

#### Endpoints Públicos (sem autenticação)

- `GET /companies/list` - Lista todas as empresas (com filtro por status)
- `GET /companies/:id` - Detalhes de uma empresa específica
- `GET /feedbacks/list` - Lista todos os feedbacks (com filtro por companyId)
- `GET /feedbacks/:id` - Detalhes de um feedback específico

#### Endpoints Admin (com autenticação)

- `GET /admin/companies` - Empresa do usuário autenticado
- `GET /admin/feedbacks` - Feedbacks do usuário autenticado
- `POST /admin/feedbacks` - Criar feedback (apenas consumidores)
- `PUT /admin/feedbacks/:id` - Atualizar feedback (apenas consumidores, só os próprios)
- `DELETE /admin/feedbacks/:id` - Deletar feedback (apenas consumidores, só os próprios)

### Regras Importantes

1. **Cadastro de Empresa**: Empresa é cadastrada automaticamente durante o registro com `userType: "company"`
2. **Criação de Feedback**: Cliente pode criar feedback apenas sobre empresas cadastradas e ativas
3. **Contexto Público**: Endpoints públicos mostram dados em contexto geral (todas as empresas/feedbacks)
4. **Contexto Admin**: Endpoints admin mostram apenas dados do usuário logado:
   - Empresa logada vê apenas dados da sua própria empresa
   - Cliente logado vê apenas seus próprios feedbacks

Para mais detalhes sobre regras de negócio, consulte [BUSINESS_RULES.md](./BUSINESS_RULES.md).

## Documentação Arquitetural

Para entender a arquitetura, padrões, decisões técnicas e estrutura do backend, consulte o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md).
