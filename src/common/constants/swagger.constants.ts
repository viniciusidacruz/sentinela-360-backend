export const SWAGGER_CONSTANTS = {
  PATH: 'api/docs',
  TITLE: 'Sentinela360 API',
  DESCRIPTION:
    'API da plataforma Sentinela360 - Gestão de reputação, feedbacks e relacionamento entre clientes e empresas',
  VERSION: '1.0',
  BEARER_AUTH_NAME: 'JWT-auth',
  TAGS: {
    AUTH: { name: 'auth', description: 'Autenticação e autorização' },
    COMPANIES: { name: 'companies', description: 'Gestão de empresas' },
    CONSUMERS: { name: 'consumers', description: 'Gestão de consumidores' },
    FEEDBACKS: { name: 'feedbacks', description: 'Feedbacks e avaliações' },
    REPUTATION: { name: 'reputation', description: 'Métricas de reputação' },
    SUBSCRIPTIONS: { name: 'subscriptions', description: 'Assinaturas' },
    BILLING: { name: 'billing', description: 'Cobrança e pagamentos' },
    TEAM: { name: 'team', description: 'Gestão de equipe' },
  },
} as const;

