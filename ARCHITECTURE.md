# Arquitetura do Backend - Sentinela360

## Visão Geral

Sentinela360 é uma plataforma de gestão de reputação, feedbacks e relacionamento entre clientes e empresas. O sistema lida com dados sensíveis, permissões complexas, auditoria obrigatória e transações financeiras.

### Responsabilidades do Backend

O backend é responsável por:

- Autenticação e autorização de usuários (Consumer e Company)
- Gerenciamento de identidade e acesso (IAM)
- Processamento de feedbacks e avaliações
- Gestão de reputação e métricas
- Processamento de assinaturas e pagamentos
- Auditoria de ações críticas
- Integrações com serviços externos (gateways de pagamento, notificações)
- Aplicação de regras de negócio e validações
- Rate limiting e proteção contra abuso

## Princípios Arquiteturais

O backend adota os seguintes princípios:

### Clean Architecture

Separação clara entre camadas de responsabilidade:
- Camada de domínio independente de frameworks e tecnologias
- Dependências apontam sempre para dentro (em direção ao domínio)
- Regras de negócio puras no núcleo da aplicação

### SOLID

Aplicação dos cinco princípios:
- **Single Responsibility**: Cada classe/entidade tem uma única responsabilidade
- **Open/Closed**: Extensível sem modificação do código existente
- **Liskov Substitution**: Implementações substituíveis sem quebrar contratos
- **Interface Segregation**: Interfaces específicas ao invés de genéricas
- **Dependency Inversion**: Dependência de abstrações, não implementações

### Clean Code

Código escrito com foco em:
- Legibilidade e clareza
- Nomes significativos
- Funções pequenas e focadas
- Comentários apenas quando necessário (código auto-explicativo)
- Testabilidade facilitada

### Domain-Driven Design (DDD)

Conceitos centrais:
- Entidades e Value Objects para modelagem do domínio
- Aggregates para consistência transacional
- Domain Services para lógica que não pertence a uma única entidade
- Policies para regras de negócio complexas
- Repositories como abstração de persistência

## Estilo Arquitetural

### Monólito Modular

O backend adota uma arquitetura de monólito modular justificada pelos seguintes fatores:

**Justificativas:**

1. **MVP com Baixo Custo**: Evita complexidade operacional inicial (Kubernetes, service mesh, múltiplos deployments)
2. **Simplicidade Operacional**: Um único deploy, um único banco de dados, monitoramento simplificado
3. **Performance**: Comunicação síncrona entre módulos sem overhead de rede
4. **Transações Distribuídas**: Consistência ACID garantida no banco de dados
5. **Preparado para Evolução**: Módulos bem definidos podem ser extraídos para microserviços futuramente

**Características:**

- Cada módulo representa um bounded context do domínio
- Módulos são independentes em termos de responsabilidade
- Comunicação entre módulos via interfaces e eventos (quando necessário)
- Módulos compartilham o mesmo banco de dados, mas com tabelas separadas por contexto

**Evolução Futura:**

Quando necessário escalar, módulos podem ser extraídos para microserviços independentes, mantendo as interfaces e contratos já estabelecidos.

## Organização por Camadas

A arquitetura é organizada em quatro camadas principais:

### Presentation Layer (Interfaces)

Responsabilidades:
- Recepção de requisições HTTP
- Validação de entrada (DTOs)
- Transformação de dados de entrada/saída
- Autenticação e autorização via guards
- Interceptação de requisições/respostas
- Tratamento de erros HTTP

Componentes:
- Controllers (NestJS)
- DTOs (Data Transfer Objects)
- Guards (autenticação/autorização)
- Interceptors (transformação, logging)
- Exception Filters

### Application Layer

Responsabilidades:
- Orquestração de casos de uso
- Coordenação entre domain e infrastructure
- Validações de aplicação
- Transformação entre DTOs e entidades de domínio
- Gerenciamento de transações

Componentes:
- Use Cases / Application Services
- Command Handlers / Query Handlers
- Application DTOs
- Mappers (DTO ↔ Entity)

### Domain Layer

Responsabilidades:
- Regras de negócio puras
- Modelagem do domínio
- Lógica invariante das entidades
- Validações de domínio
- Interfaces de repositório (contratos)

Componentes:
- Entities
- Value Objects
- Domain Services
- Policies
- Repository Interfaces
- Domain Events (quando aplicável)

### Infrastructure Layer

Responsabilidades:
- Implementação de persistência
- Integrações externas
- Implementação de serviços técnicos
- Configurações de frameworks
- Acesso a APIs de terceiros

Componentes:
- Repositories (implementações)
- ORM entities/mappers
- External service clients
- Message brokers (quando aplicável)
- Cache implementations (quando aplicável)

### Estrutura de Módulo

Cada módulo de negócio segue a organização por camadas:

```
modules/
  {domain}/
    application/
      use-cases/
      dto/
      mappers/
    domain/
      entities/
      value-objects/
      policies/
      services/
      repositories/  # interfaces
    infrastructure/
      repositories/  # implementações
      external/
    presentation/
      controllers/
      dto/
      guards/
      interceptors/
```

## Domínios do Sistema

### Auth (Autenticação)

Responsabilidades:
- Autenticação de usuários (Consumer e Company)
- Geração e validação de tokens JWT
- Gerenciamento de sessões
- Refresh tokens
- Logout e invalidação de sessões

Entidades Principais:
- User (base para Consumer e Company)
- Session
- RefreshToken

### IAM (Identity and Access Management)

Responsabilidades:
- Gerenciamento de roles (papéis)
- Gerenciamento de permissions (permissões)
- Atribuição de roles e permissions a usuários
- Hierarquia de permissões
- Políticas de acesso baseadas em contexto

Entidades Principais:
- Role
- Permission
- UserRole (relacionamento)
- RolePermission (relacionamento)

Conceitos:
- Roles podem ter múltiplas permissions
- Usuários podem ter múltiplas roles
- Permissions são verificadas em nível de ação/recursos
- Contexto adicional (ex: usuário pertence à empresa X) influencia autorização

### Company (Empresa)

Responsabilidades:
- Cadastro e gestão de empresas
- Informações da empresa (nome, CNPJ, endereço)
- Status e validações de empresa
- Relacionamento com assinaturas

Entidades Principais:
- Company
- CompanySettings

Regras de Negócio:
- CNPJ único por empresa
- Validação de CNPJ
- Empresa inativa não pode receber feedbacks

### Consumer (Cliente)

Responsabilidades:
- Cadastro e gestão de consumidores
- Perfil do consumidor
- Histórico de feedbacks

Entidades Principais:
- Consumer
- ConsumerProfile

### Feedback

Responsabilidades:
- Criação de feedbacks por consumidores
- Visualização de feedbacks por empresas
- Respostas de empresas aos feedbacks
- Moderação de feedbacks
- Cálculo de métricas de reputação

Entidades Principais:
- Feedback
- FeedbackResponse
- FeedbackRating

Regras de Negócio:
- Consumidor pode criar apenas um feedback por empresa (ou múltiplos conforme regra de negócio)
- Feedback possui rating (1-5 estrelas)
- Empresa pode responder ao feedback
- Feedback pode ser moderado/ocultado
- Feedback contribui para cálculo de reputação

### Reputation (Reputação)

Responsabilidades:
- Cálculo de métricas de reputação
- Agregação de ratings
- Histórico de reputação
- Comparação temporal

Entidades Principais:
- ReputationMetrics
- ReputationHistory

Métricas:
- Rating médio
- Total de feedbacks
- Distribuição de ratings
- Tendência (melhora/piora)
- Ranking comparativo (quando aplicável)

### Subscription (Assinaturas)

Responsabilidades:
- Gestão de planos de assinatura
- Criação e renovação de assinaturas
- Cancelamento de assinaturas
- Upgrade/downgrade de planos
- Período de trial

Entidades Principais:
- SubscriptionPlan
- Subscription
- SubscriptionStatus

Estados:
- Trial
- Active
- Canceled
- Expired
- Suspended

### Billing (Cobrança)

Responsabilidades:
- Processamento de pagamentos
- Gestão de faturas
- Webhooks de pagamento
- Idempotência de transações
- Reconciliação financeira

Entidades Principais:
- Invoice
- Payment
- PaymentMethod
- BillingCycle

Regras de Negócio:
- Assinatura ativa requer pagamento válido
- Webhooks devem ser idempotentes
- Validação de assinatura em webhooks
- Registro de todas as transações financeiras

### Audit (Auditoria)

Responsabilidades:
- Registro de ações críticas
- Rastreabilidade de alterações
- Log de eventos de segurança
- Compliance e conformidade

Entidades Principais:
- AuditLog
- AuditEvent

Eventos Auditados:
- Criação/alteração/exclusão de entidades críticas
- Alterações de permissões
- Acesso a dados sensíveis
- Transações financeiras
- Alterações de assinatura
- Tentativas de acesso não autorizado

### Team (Equipe)

Responsabilidades:
- Gerenciamento de membros da equipe
- Invites para membros
- Atribuição de roles por membro
- Gestão de acesso por contexto de empresa

Entidades Principais:
- TeamMember
- TeamInvite

Regras de Negócio:
- Membro pertence a uma empresa
- Membro possui roles específicas na empresa
- Permissões são verificadas no contexto da empresa
- Owner/Admin da empresa pode gerenciar membros

## Principais Use Cases por Domínio

### Auth

- AuthenticateUser: Autenticação com email/senha, retorna JWT
- RefreshToken: Renovação de token via refresh token
- Logout: Invalidação de sessão e tokens
- ValidateToken: Validação de token JWT

### IAM

- AssignRoleToUser: Atribuição de role a usuário
- RemoveRoleFromUser: Remoção de role de usuário
- CheckPermission: Verificação de permissão para ação
- ListUserPermissions: Listagem de permissões efetivas do usuário

### Company

- CreateCompany: Criação de nova empresa
- UpdateCompany: Atualização de dados da empresa
- GetCompanyDetails: Obtenção de detalhes da empresa
- ActivateCompany: Ativação de empresa
- DeactivateCompany: Desativação de empresa

### Consumer

- RegisterConsumer: Cadastro de consumidor
- UpdateConsumerProfile: Atualização de perfil
- GetConsumerProfile: Obtenção de perfil do consumidor

### Feedback

- CreateFeedback: Criação de feedback por consumidor
- ListCompanyFeedbacks: Listagem de feedbacks de uma empresa
- RespondToFeedback: Resposta da empresa ao feedback
- ModerateFeedback: Moderação/ocultação de feedback
- CalculateReputation: Cálculo de métricas de reputação

### Subscription

- CreateSubscription: Criação de nova assinatura
- RenewSubscription: Renovação automática de assinatura
- CancelSubscription: Cancelamento de assinatura
- UpgradeSubscription: Upgrade de plano
- DowngradeSubscription: Downgrade de plano
- GetSubscriptionStatus: Verificação de status da assinatura

### Billing

- ProcessPayment: Processamento de pagamento
- HandleWebhook: Processamento de webhook do gateway
- GenerateInvoice: Geração de fatura
- RetryFailedPayment: Retentativa de pagamento falho
- GetBillingHistory: Histórico de cobranças

### Audit

- LogEvent: Registro de evento auditado
- QueryAuditLog: Consulta de logs de auditoria
- GenerateAuditReport: Geração de relatório de auditoria

### Team

- InviteTeamMember: Convite para membro da equipe
- AcceptInvite: Aceitação de convite
- RemoveTeamMember: Remoção de membro
- UpdateMemberRole: Atualização de role do membro
- ListTeamMembers: Listagem de membros da equipe

## Regras de Negócio Críticas

### Validações Obrigatórias

1. **Autenticação**
   - Token JWT deve ser válido e não expirado
   - Refresh token deve ser válido e não utilizado
   - Sessão deve estar ativa

2. **Autorização**
   - Usuário deve possuir permissão para ação solicitada
   - Contexto da empresa deve ser validado (quando aplicável)
   - Owner/Admin da empresa tem permissões totais na empresa

3. **Feedback**
   - Consumidor deve estar autenticado para criar feedback
   - Empresa deve estar ativa para receber feedback
   - Rating deve estar no intervalo válido (1-5)
   - Feedback deve estar completo (rating obrigatório)

4. **Assinatura**
   - Empresa deve ter assinatura ativa para funcionalidades premium
   - Assinatura expirada bloqueia funcionalidades
   - Trial tem período limitado
   - Upgrade/downgrade respeita ciclo de cobrança

5. **Cobrança**
   - Webhook deve ser validado (assinatura)
   - Transações devem ser idempotentes
   - Pagamento deve ser processado antes de ativar assinatura
   - Falha no pagamento suspende assinatura

6. **Equipe**
   - Membro deve ser convidado antes de ser adicionado
   - Convite deve ser aceito
   - Owner não pode ser removido
   - Apenas Owner/Admin pode gerenciar membros

### Regras de Consistência

1. **Integridade Referencial**
   - Feedback requer Company e Consumer válidos
   - Subscription requer Company válida
   - TeamMember requer Company e User válidos
   - Payment requer Subscription válida

2. **Transações Atômicas**
   - Criação de assinatura e primeiro pagamento
   - Processamento de webhook e atualização de status
   - Alteração de permissões e registro de auditoria

3. **Eventos Obrigatórios**
   - Ações críticas devem gerar eventos de auditoria
   - Mudanças de status de assinatura devem ser registradas
   - Alterações de permissões devem ser auditadas

## Entities, Value Objects e Policies

### Entities

Entidades possuem identidade única e ciclo de vida gerenciado:

- **User**: Identidade base, pode ser Consumer ou Company
- **Company**: Empresa cadastrada no sistema
- **Consumer**: Cliente/consumidor
- **Feedback**: Avaliação de empresa por consumidor
- **Subscription**: Assinatura de empresa
- **Invoice**: Fatura gerada
- **Payment**: Pagamento processado
- **TeamMember**: Membro da equipe de uma empresa
- **Role**: Papel/perfil de usuário
- **Permission**: Permissão específica

Características:
- Possuem ID único
- Mutáveis (estado pode mudar)
- Persistidas no banco de dados
- Validações de invariantes no construtor/métodos

### Value Objects

Objetos imutáveis que representam conceitos do domínio:

- **Email**: Validação de formato e normalização
- **CNPJ**: Validação e formatação
- **Rating**: Valor entre 1-5 com validação
- **Money**: Valor monetário com moeda
- **Address**: Endereço completo
- **DateRange**: Intervalo de datas
- **SubscriptionStatus**: Enum de estados de assinatura

Características:
- Imutáveis
- Sem identidade (comparados por valor)
- Validações automáticas
- Sempre válidos (não podem estar em estado inválido)

### Policies

Classes que encapsulam regras de negócio complexas:

- **FeedbackCreationPolicy**: Define quando feedback pode ser criado
- **SubscriptionAccessPolicy**: Define acesso baseado em assinatura
- **PermissionPolicy**: Define verificação de permissões
- **ReputationCalculationPolicy**: Define cálculo de reputação
- **BillingRetryPolicy**: Define política de retentativas de pagamento

Características:
- Encapsulam lógica de negócio complexa
- Testáveis isoladamente
- Reutilizáveis em diferentes contextos
- Podem ser compostas

## Estratégia de Segurança

### Autenticação

**JWT com Cookies HttpOnly**

- Token JWT armazenado em cookie HttpOnly (proteção XSS)
- Cookie configurado com SameSite=Strict (proteção CSRF)
- Secure flag em produção (HTTPS obrigatório)
- Refresh token separado para renovação
- Expiração de tokens configurável

**Fluxo de Autenticação:**

1. Usuário faz login (email/senha)
2. Sistema valida credenciais
3. Gera JWT e refresh token
4. Armazena tokens em cookies HttpOnly
5. Retorna sucesso (sem tokens no body)

**Renovação de Token:**

1. Cliente faz requisição com refresh token
2. Sistema valida refresh token
3. Gera novo JWT e refresh token
4. Atualiza cookies
5. Invalida refresh token antigo

### Autorização

**RBAC (Role-Based Access Control)**

- Permissões agrupadas em roles
- Usuários possuem roles
- Verificação de permissão em nível de ação/recurso
- Contexto adicional (empresa) influencia autorização

**Implementação:**

- Guards do NestJS para verificação
- Decorator @RequirePermission para endpoints
- Verificação em nível de método/controller
- Política de acesso baseada em contexto

**Hierarquia de Permissões:**

- Super Admin: Acesso total ao sistema
- Company Owner: Acesso total à empresa
- Company Admin: Acesso administrativo à empresa
- Team Member: Acesso baseado em roles atribuídos
- Consumer: Acesso apenas a recursos próprios

### Rate Limiting

Proteção contra abuso implementada em três níveis:

1. **Por IP**: Limitação global por endereço IP
2. **Por Usuário**: Limitação por usuário autenticado
3. **Por Empresa**: Limitação por empresa (quando aplicável)

**Configuração:**

- Diferentes limites por endpoint
- Endpoints públicos: limite mais restritivo
- Endpoints autenticados: limite mais flexível
- Endpoints críticos: limite adicional por empresa

**Implementação:**

- Middleware de rate limiting
- Armazenamento em memória ou Redis (futuro)
- Headers de resposta informando limites

### Auditoria

**Obrigatoriedade:**

Todas as ações críticas devem ser auditadas:

- Criação/alteração/exclusão de entidades críticas
- Alterações de permissões e roles
- Acesso a dados sensíveis
- Transações financeiras
- Alterações de assinatura
- Tentativas de acesso não autorizado

**Registro de Auditoria:**

- Timestamp preciso
- Identificação do usuário
- Ação realizada
- Recursos afetados
- Contexto adicional (IP, user agent)
- Resultado da ação (sucesso/falha)

**Retenção:**

- Logs mantidos por período definido
- Logs críticos com retenção estendida
- Possibilidade de exportação para análise

### Proteções Adicionais

- **CORS**: Configuração restritiva de origens permitidas
- **Helmet**: Headers de segurança HTTP
- **Validation**: Validação rigorosa de entrada
- **Sanitization**: Sanitização de dados de entrada
- **SQL Injection**: Proteção via ORM parametrizado
- **XSS**: Proteção via sanitização e Content-Security-Policy

## Estratégia de Assinaturas e Monetização

### Modelo de Assinatura

**Planos:**

- Planos com diferentes níveis de funcionalidade
- Limites por plano (feedbacks, membros, etc.)
- Período de trial gratuito
- Renovação automática

**Estados da Assinatura:**

- Trial: Período de teste gratuito
- Active: Assinatura ativa e paga
- Canceled: Cancelada pelo usuário (acesso até fim do período)
- Expired: Período expirado sem renovação
- Suspended: Suspensa por falha no pagamento

### Processamento de Pagamentos

**Gateway de Pagamento:**

- Integração com gateway externo (Stripe, PagSeguro, etc.)
- Webhooks para eventos de pagamento
- Processamento assíncrono de eventos

**Fluxo de Assinatura:**

1. Usuário seleciona plano
2. Sistema cria assinatura (status: pending)
3. Redireciona para gateway de pagamento
4. Gateway processa pagamento
5. Webhook confirma pagamento
6. Sistema ativa assinatura (status: active)
7. Fatura é gerada

**Renovação Automática:**

1. Sistema identifica assinatura próxima ao vencimento
2. Processa cobrança no gateway
3. Webhook confirma pagamento
4. Renova assinatura e gera nova fatura
5. Em caso de falha, suspende assinatura

### Webhooks

**Segurança:**

- Validação de assinatura (signature verification)
- Validação de origem (IP whitelist quando possível)
- Idempotência obrigatória

**Idempotência:**

- Webhook ID único por evento
- Registro de webhooks processados
- Verificação antes de processar
- Retorno idempotente para eventos duplicados

**Eventos Processados:**

- payment.succeeded
- payment.failed
- subscription.renewed
- subscription.canceled
- invoice.paid
- invoice.payment_failed

### Funcionalidades por Plano

- Limites de feedbacks por mês
- Número de membros da equipe
- Funcionalidades avançadas (relatórios, integrações)
- Suporte prioritário
- Customizações

### Cancelamento e Downgrade

**Cancelamento:**

- Usuário pode cancelar a qualquer momento
- Acesso mantido até fim do período pago
- Não renova automaticamente

**Downgrade:**

- Downgrade para plano inferior
- Efetivo no próximo ciclo de cobrança
- Funcionalidades reduzidas aplicadas após período atual

## Estratégia de Escalabilidade

### MVP (Fase Inicial)

**Foco em Baixo Custo:**

- Monólito modular em servidor único
- PostgreSQL como banco de dados único
- Sem cache distribuído (cache em memória quando necessário)
- Sem filas de mensagens (processamento síncrono)
- Deploy simples e direto

**Limitações Aceitas:**

- Processamento síncrono de webhooks
- Sem cache distribuído
- Sem processamento assíncrono de tarefas pesadas
- Escalabilidade vertical (servidor mais potente)

### Evolução Futura

**Identificação de Gargalos:**

- Monitoramento de performance e uso
- Identificação de módulos com maior carga
- Análise de queries e otimização

**Estratégias de Escalabilidade:**

1. **Cache Distribuído**
   - Redis para cache de consultas frequentes
   - Cache de sessões e tokens
   - Cache de métricas de reputação

2. **Filas de Mensagens**
   - Processamento assíncrono de webhooks
   - Processamento de cálculos pesados
   - Envio de emails e notificações

3. **Read Replicas**
   - Replicas de leitura do PostgreSQL
   - Distribuição de carga de leitura
   - Escrita apenas no master

4. **Extração de Microserviços**
   - Módulos com maior carga extraídos
   - Comunicação via eventos ou API
   - Deploy independente

5. **CDN e Assets**
   - Assets estáticos em CDN
   - Cache de respostas de API quando aplicável

**Preparação Arquitetural:**

- Módulos já preparados para extração
- Interfaces bem definidas
- Eventos de domínio quando necessário
- Abstrações de infraestrutura (cache, filas)

### Métricas de Escalabilidade

Monitoramento contínuo de:

- Tempo de resposta de APIs
- Throughput de requisições
- Uso de CPU e memória
- Performance de queries
- Taxa de erros
- Custo operacional

## Diretrizes de Código e Boas Práticas

### Estrutura de Código

**Organização:**

- Um arquivo por classe/interface
- Nomes de arquivo em kebab-case
- Agrupamento lógico por funcionalidade
- Imports organizados (externos, internos, relativos)

**Nomenclatura:**

- Classes: PascalCase
- Interfaces: PascalCase (prefixo I opcional)
- Funções/Métodos: camelCase
- Variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Arquivos: kebab-case

### TypeScript

**Tipagem:**

- Tipos explícitos (evitar any)
- Interfaces para contratos
- Types para uniões e composições
- Generics quando apropriado
- Strict mode habilitado

**Boas Práticas:**

- Null safety (uso de optional chaining)
- Validação de tipos em runtime quando necessário
- Uso de enums para constantes relacionadas
- Evitar type assertions desnecessárias

### NestJS

**Módulos:**

- Um módulo por domínio/bounded context
- Módulos compartilham apenas interfaces
- Feature modules organizados por funcionalidade

**Dependency Injection:**

- Injeção via constructor
- Interfaces para abstrações
- Providers com escopo apropriado (singleton, request-scoped)

**Decorators:**

- Uso de decorators do NestJS para validação
- Decorators customizados para cross-cutting concerns
- Guards para autenticação/autorização

### Testes

**Estratégia:**

- Testes unitários para lógica de domínio
- Testes de integração para casos de uso
- Testes E2E para fluxos críticos
- Mocks para dependências externas

**Cobertura:**

- Foco em código crítico (domínio, regras de negócio)
- Cobertura mínima definida por módulo
- Testes devem ser rápidos e determinísticos

### Tratamento de Erros

**Hierarquia de Erros:**

- Domain exceptions para erros de negócio
- Application exceptions para erros de aplicação
- Infrastructure exceptions para erros técnicos

**Padronização:**

- Códigos de erro consistentes
- Mensagens claras (sem informações sensíveis)
- Logging apropriado de erros
- Transformação de erros em respostas HTTP adequadas

### Performance

**Otimizações:**

- Queries otimizadas (indexes, evitar N+1)
- Paginação obrigatória para listagens
- Lazy loading quando apropriado
- Cache de consultas frequentes

**Monitoramento:**

- Logging de operações lentas
- Métricas de performance
- Profiling quando necessário

### Documentação

**Código:**

- Comentários apenas quando código não é auto-explicativo
- JSDoc para APIs públicas
- README por módulo quando necessário

**Documentação Externa:**

- README.md para visão geral
- ARCHITECTURE.md para arquitetura
- ADRs para decisões arquiteturais

## Git Flow

### Estrutura de Branches

**Branches Principais:**

- `main`: Código em produção (protegido)
- `develop`: Branch de desenvolvimento (integração)

**Branches de Suporte:**

- `feature/*`: Novas funcionalidades
- `fix/*`: Correções de bugs
- `hotfix/*`: Correções urgentes em produção
- `refactor/*`: Refatorações
- `docs/*`: Documentação

### Fluxo de Trabalho

**Desenvolvimento de Feature:**

1. Criar branch a partir de `develop`: `feature/nome-da-feature`
2. Desenvolver e commitar
3. Abrir Pull Request para `develop`
4. Code review obrigatório
5. Merge após aprovação
6. Branch é deletada após merge

**Correção de Bug:**

1. Criar branch a partir de `develop`: `fix/descricao-do-bug`
2. Desenvolver correção
3. Abrir Pull Request para `develop`
4. Code review
5. Merge após aprovação

**Hotfix:**

1. Criar branch a partir de `main`: `hotfix/descricao`
2. Desenvolver correção
3. Abrir Pull Request para `main`
4. Code review urgente
5. Merge em `main`
6. Merge em `develop`
7. Deploy imediato

**Release:**

1. Criar branch a partir de `develop`: `release/versao`
2. Preparação de release (versionamento, changelog)
3. Merge em `main` e tag de versão
4. Merge em `develop`

### Commits

**Convenção:**

- Mensagens claras e descritivas
- Prefixo indicando tipo: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Descrição do que foi feito e por quê

**Exemplos:**

```
feat: adiciona autenticação JWT com cookies HttpOnly
fix: corrige cálculo de reputação para empresas sem feedbacks
refactor: extrai política de permissões para classe separada
docs: atualiza documentação de arquitetura
```

### Pull Requests

**Requisitos:**

- Descrição clara do que foi feito
- Referência a issues quando aplicável
- Testes adicionados/modificados
- Sem conflitos com branch base
- Code review obrigatório (mínimo 1 aprovação)
- CI/CD passando

**Code Review:**

- Foco em lógica, arquitetura e boas práticas
- Feedback construtivo
- Aprovação necessária para merge

## Estratégia para Decisões Arquiteturais (ADR)

### Arquitetura Decision Records

Decisões arquiteturais importantes devem ser documentadas em ADRs (Architecture Decision Records).

### Formato do ADR

Cada ADR segue o formato:

**Estrutura:**

1. **Título**: Número sequencial e título descritivo
2. **Status**: Proposta, Aceita, Rejeitada, Depreciada, Substituída
3. **Contexto**: Situação que levou à decisão
4. **Decisão**: Decisão tomada
5. **Consequências**: Impactos positivos e negativos

**Exemplo de Nomeação:**

```
docs/adr/
  001-monolito-modular.md
  002-postgresql-como-banco-principal.md
  003-jwt-com-cookies-httponly.md
  004-clean-architecture.md
```

### Quando Criar um ADR

ADRs devem ser criados para decisões que:

- Afetam a estrutura ou organização do código
- Impactam múltiplos módulos ou times
- Têm trade-offs significativos
- São difíceis de reverter
- Geram debate técnico

### Processo de ADR

1. **Identificação**: Identificar necessidade de decisão arquitetural
2. **Discussão**: Debater opções com time técnico
3. **Documentação**: Criar ADR com todas as opções consideradas
4. **Aprovação**: Aprovar ADR (consenso ou decisão de arquiteto)
5. **Implementação**: Implementar decisão documentada
6. **Revisão**: Revisar ADR quando contexto mudar

### Manutenção de ADRs

- ADRs são documentos vivos
- Podem ser atualizados quando contexto muda
- Status pode mudar (Depreciada, Substituída)
- ADRs antigos não são deletados (histórico)

### Localização

ADRs ficam em `docs/adr/` na raiz do repositório, organizados numericamente.

