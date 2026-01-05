# CURL Commands - Reputation Module

## Configuração Base

```bash
BASE_URL="http://localhost:3333"
# ou use a URL do seu ambiente
```

---

## 1. Login (Empresa) - Para obter cookies de autenticação

```bash
curl -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@example.com",
    "password": "senhaSegura123"
  }' \
  -c cookies.txt \
  -v
```

**Resposta esperada:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "empresa@example.com",
    "name": "Maria Santos",
    "roles": ["COMPANY_OWNER"],
    "createdAt": "..."
  }
}
```

**Nota:** Os cookies (access_token e refresh_token) serão salvos em `cookies.txt` para uso nas próximas requisições.

---

## 2. Obter Métricas da Empresa Autenticada (Admin)

Este endpoint busca automaticamente a empresa do usuário logado. **As métricas são calculadas automaticamente se não existirem** (desde que a empresa tenha feedbacks).

```bash
curl -X GET "${BASE_URL}/admin/reputation/metrics" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -v
```

**Comportamento:**

- Se as métricas já existem: retorna as métricas atuais
- Se as métricas não existem mas há feedbacks: calcula e cria as métricas automaticamente
- Se não há feedbacks: retorna erro 404

**Resposta esperada:**

```json
{
  "metrics": {
    "id": "...",
    "companyId": "9070756c-6a5c-4eb0-b6d8-f56a5bdce772",
    "averageRating": 4.5,
    "totalFeedbacks": 10,
    "distribution": {
      "rating1": 0,
      "rating2": 1,
      "rating3": 2,
      "rating4": 3,
      "rating5": 4,
      "percentages": {
        "rating1": 0,
        "rating2": 10,
        "rating3": 20,
        "rating4": 30,
        "rating5": 40
      }
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 3. Obter Métricas Públicas de uma Empresa Específica

Este endpoint é público e não requer autenticação.

```bash
COMPANY_ID="9070756c-6a5c-4eb0-b6d8-f56a5bdce772"

curl -X GET "${BASE_URL}/reputation/companies/${COMPANY_ID}" \
  -H "Content-Type: application/json" \
  -v
```

**Resposta esperada:** Mesmo formato do endpoint admin.

---

## 4. Calcular/Atualizar Métricas de Reputação

Este endpoint calcula as métricas baseadas nos feedbacks atuais e atualiza o banco.

```bash
curl -X POST "${BASE_URL}/admin/reputation/calculate" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "saveHistory": true
  }' \
  -v
```

**Parâmetros:**

- `saveHistory` (opcional, default: `false`): Se `true`, salva um snapshot no histórico antes de atualizar.

**Resposta esperada:**

```json
{
  "message": "Reputation calculated successfully",
  "metrics": {
    "id": "...",
    "companyId": "...",
    "averageRating": 4.5,
    "totalFeedbacks": 10,
    "distribution": {
      "rating1": 0,
      "rating2": 1,
      "rating3": 2,
      "rating4": 3,
      "rating5": 4
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 5. Obter Histórico de Reputação (Admin)

```bash
curl -X GET "${BASE_URL}/admin/reputation/history?limit=30" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -v
```

**Query Parameters:**

- `limit` (opcional, default: 30): Número de registros históricos a retornar.

**Resposta esperada:**

```json
{
  "history": [
    {
      "id": "...",
      "averageRating": 4.3,
      "totalFeedbacks": 8,
      "distribution": {
        "rating1": 0,
        "rating2": 1,
        "rating3": 2,
        "rating4": 2,
        "rating5": 3
      },
      "recordedAt": "..."
    }
  ],
  "trend": "up"
}
```

**Trend values:**

- `up`: Reputação melhorou
- `down`: Reputação piorou
- `stable`: Reputação estável

---

## 6. Obter Histórico Público de uma Empresa

```bash
COMPANY_ID="9070756c-6a5c-4eb0-b6d8-f56a5bdce772"

curl -X GET "${BASE_URL}/reputation/companies/${COMPANY_ID}/history?limit=30" \
  -H "Content-Type: application/json" \
  -v
```

**Resposta esperada:** Mesmo formato do endpoint admin.

---

## 7. Obter Rankings de Empresas (Público)

```bash
curl -X GET "${BASE_URL}/reputation/rankings?limit=100&category=AUTOMOTIVE" \
  -H "Content-Type: application/json" \
  -v
```

**Query Parameters:**

- `limit` (opcional, default: 100): Número de empresas no ranking.
- `category` (opcional): Filtrar por categoria da empresa (ex: `AUTOMOTIVE`, `FOOD_AND_BEVERAGE`, etc.).

**Resposta esperada:**

```json
{
  "rankings": [
    {
      "position": 1,
      "companyId": "...",
      "companyName": "Empresa XYZ Ltda",
      "averageRating": 4.8,
      "totalFeedbacks": 50,
      "distribution": {
        "rating1": 0,
        "rating2": 1,
        "rating3": 2,
        "rating4": 10,
        "rating5": 37
      }
    }
  ],
  "meta": {
    "total": 1,
    "limit": 100
  }
}
```

---

## Exemplo Completo: Fluxo de Análise de Campanha

```bash
#!/bin/bash

BASE_URL="http://localhost:3333"
EMAIL="empresa@example.com"
PASSWORD="senhaSegura123"

echo "1. Fazendo login..."
curl -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"${PASSWORD}\"}" \
  -c cookies.txt \
  -s | jq '.'

echo -e "\n2. Obtendo métricas atuais..."
curl -X GET "${BASE_URL}/admin/reputation/metrics" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -s | jq '.'

echo -e "\n3. Calculando/atualizando métricas..."
curl -X POST "${BASE_URL}/admin/reputation/calculate" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"saveHistory": true}' \
  -s | jq '.'

echo -e "\n4. Obtendo histórico de reputação..."
curl -X GET "${BASE_URL}/admin/reputation/history?limit=10" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -s | jq '.'

echo -e "\n5. Verificando posição no ranking..."
curl -X GET "${BASE_URL}/reputation/rankings?limit=50" \
  -H "Content-Type: application/json" \
  -s | jq '.rankings[] | select(.companyName == "Empresa XYZ Ltda")'
```

---

## Troubleshooting

### Erro 401 (Unauthorized)

- Verifique se os cookies foram salvos corretamente
- Faça login novamente para obter novos cookies

### Erro 403 (Forbidden)

- Verifique se você está logado como empresa (COMPANY_OWNER)
- Certifique-se de que a empresa existe e está associada ao usuário

### Erro 404 (Not Found)

- Verifique se a empresa existe
- Verifique se as métricas foram calculadas (use `POST /admin/reputation/calculate` primeiro)
- Certifique-se de que está usando o endpoint correto:
  - Admin: `/admin/reputation/metrics` (sem companyId)
  - Público: `/reputation/companies/:companyId`

### Métricas não encontradas

- **As métricas são criadas automaticamente** quando você acessa `GET /admin/reputation/metrics` pela primeira vez (se houver feedbacks)
- Se ainda assim receber 404, verifique se a empresa possui feedbacks ativos
- Use `POST /admin/reputation/calculate` apenas se quiser **forçar uma atualização** das métricas existentes

---

## Notas Importantes

1. **Primeira vez:** As métricas são **criadas automaticamente** quando você acessa `GET /admin/reputation/metrics` pela primeira vez (se houver feedbacks). Não é mais necessário chamar `POST /admin/reputation/calculate` antes.
2. **Atualização manual:** Use `POST /admin/reputation/calculate` apenas se quiser **forçar uma atualização** das métricas existentes ou salvar um snapshot no histórico.
3. **Cookies:** Os endpoints admin requerem cookies HttpOnly (obtidos no login)
4. **Histórico:** O histórico só é criado quando `saveHistory: true` no cálculo
5. **Rankings:** Ordenados por `averageRating` (descendente)
6. **Distribuição:** Mostra contagem e percentuais de cada rating (1-5)
