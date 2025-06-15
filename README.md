# Launchstore

## Visão Geral
Esta aplicação consiste no propósito de simular um e-commerce, permitindo ao usuário autenticado realizar compras e também vendas.
<br>Para melhor entendimento do funcionamento do sistema, acesse o [documento de especificação de requisitos](./requirements.md)

## Execução

Para executar a aplicação, siga os seguintes passos:

### 1. Subir container do banco de dados
```
docker compose up -d
```

### 2. Criar e popular as tabelas
```
npm run start:setup
```

### 3. Iniciar a aplicação
```
npm run start:dev
```
> O projeto roda na versão 18.19.1 do node.js

<br>

> A prática leva a perfeição. Nunca desista!
