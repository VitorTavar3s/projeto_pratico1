

# Projeto Prático Newtoo


## Iniciar Projeto

```bash
$ npm install
```

## Requisitos

• Ter banco de dados relacional Postgresql instalado  
  • Criar banco de dados com o nome "api-planos"  
  • Colocar no arquivo ".env" na raiz do projeto as credenciais 
```bash
  DATABASE_URL="postgresql://USUÁRIO:SENHA@localhost:PORTA/NOME DO BANCO?schema=public"
```
• Ter conta no stripe : https://stripe.com/br  
 • Colocar no arquivo ".env" na raiz do projeto a chave secreta da API do stripe
```bash
  STRIPE_SECRET="sk_test_NUMERO DA CHAVE API STRIPE"
```
### Rodar Projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### Cadastrar Usuário 
Acessar endpoint:
```bash
POST: http://localhost:3000/auth/register
• Fazer uma requisição JSON nesse modelo:
{
  "email": "vitor@email.com", - Passando o email
  "password": "vitor123", - Senha
  "role": "admin" - Regra de acesso(Administrador nesse caso, se não for informado o "role" será um usuário padrão)
}
•Como resposta terá um "access_token": "CÓDIGO DE ACESSO", esse código será pra autenticar o acesso nos endpoints(Expira em 1 dia)
```
### Criar Plano 
Coloque o acess_token no header da requisição(Bearer Token)
```bash
POST: http://localhost:3000/plans
• Fazer uma requisição JSON nesse modelo:
{
    "name": "Básico", - Nome do Plano
    "description": "Plano com acesso limitado de 30 aulas mensais", - Descrição do Plano
    "price": 45.50, - Preço do Plano
    "billingCycle": "monthly" - Ciclo da Fatura (Mensal ou Anual)
}
```
### Buscar Planos 
```bash
GET: http://localhost:3000/plans
```
### Buscar Plano por ID
```bash
GET: http://localhost:3000/plans/ID do plano 
```
### Deletar Plano 
```bash
DELETE: http://localhost:3000/plans/ID do plano
```
### Criar Assinatura
```bash
POST: http://localhost:3000/subscription
• Fazer uma requisição JSON nesse modelo:
{
  "userId": "cd40e614-32cf-4f84-aa36-3e24c81dbadb", - ID do Usuário
  "planId": "26570b49-8201-410c-9e17-3f4dcca06037" - ID do Plano
}
```
### Buscar Assinatura por ID
```bash
GET: http://localhost:3000/subscription/ID da Assinatura
```
### Deletar Assinatura
```bash
DELETE: http://localhost:3000/subscription/ID da Assinatura
```
### Criar Intenção de Pagamento
```bash
POST:http://localhost:3000/payments
• Fazer uma requisição JSON nesse modelo:
{
  "userId": "382e5aff-1095-49f1-ad2f-c65ae872839d",
  "amount": 100,
  "currency": "eul"
}
```
### Buscar Status do pagamento
```bash
GET: http://localhost:3000/payments/ID do Pagamento
```
### Enviar fatura pro email do usuário
```bash
POST: http://localhost:3000/invoices/send/ID do usuário
```
### Buscar por fatura 
```bash
GET: http://localhost:3000/invoices/ID da fatura
```
### Listar faturas do usuário
```bash
GET: http://localhost:3000/invoices/user/ID do usuário
```

