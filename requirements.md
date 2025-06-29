# 📝 Documento de Especificação de Requisitos — Launchstore

## 1. Introdução

### 1.1. Propósito do Documento
Este documento tem como objetivo descrever os requisitos funcionais e não funcionais do sistema **Launchstore**, uma plataforma de e-commerce para cadastro, venda e compra de produtos.

### 1.2. Escopo do Sistema
A aplicação permite que usuários realizem cadastro, publiquem produtos, façam compras, acompanhem seus pedidos e gerenciem seus dados. A gestão administrativa de produtos, categorias e pedidos também é contemplada.

---

## 2. Descrição Geral

### 2.1. Usuários do Sistema
- **Usuário Visitante:** Acesso público para navegação e busca.
- **Usuário Cliente:** Realiza cadastro, compra produtos e acompanha pedidos.
- **Administrador:** Gerencia produtos, categorias, pedidos e usuários.

---

## 3. Requisitos Funcionais

### RF01 — Autenticação e Autorização
- Permitir cadastro de usuários.
- Permitir login e logout.
- Proteção de rotas restritas.

### RF02 — Gestão de Usuários
- Cadastro de informações pessoais.
- Edição de dados do usuário.
- Exclusão de conta.

### RF03 — Gestão de Produtos
- Cadastro, edição e exclusão de produtos.
- Upload e gerenciamento de imagens.
- Listagem dos produtos do usuário.

### RF04 — Gestão de Categorias
- Cadastro, edição e exclusão de categorias.
- Associação de produtos às categorias.

### RF05 — Navegação e Busca
- Listagem de produtos.
- Filtro por categorias.
- Busca por nome ou descrição.

### RF06 — Carrinho de Compras
- Adicionar, remover e atualizar itens.
- Cálculo de subtotal e total.

### RF07 — Processo de Compra
- Finalização de pedido.
- Confirmação e resumo da compra.

### RF08 — Gestão de Pedidos
- Usuário visualiza e acompanha status.
- Administrador gerencia status dos pedidos.

---

## 4. Requisitos Não Funcionais

### RNF01 — Arquitetura
- Padrão MVC com Node.js, Express e Nunjucks.

### RNF02 — Banco de Dados
- PostgreSQL com modelo relacional.

### RNF03 — Segurança
- Senhas criptografadas.
- Validação de dados de entrada.
- Upload restrito a imagens.

### RNF04 — Usabilidade
- Interface responsiva e intuitiva.

### RNF05 — Desempenho
- Leve e otimizado para MVP.

### RNF06 — Escalabilidade
- Suporte básico, recomendações para produção incluem uso de storage externo e balanceamento de carga.

### RNF07 — Manutenibilidade
- Código organizado, modular e documentado.

---

## 5. Diagramas

### 5.1. Diagrama de Casos de Uso

![diagrama_casos_de_uso](https://github.com/user-attachments/assets/b9210fc7-2204-4ffc-adad-3be6ce1d2032)


### 5.2. Diagrama Entidade-Relacionamento (ER)

```mermaid
erDiagram
  USERS {
    int id PK
    string name
    string email
    string password
    string cpf_cnpj
    string cep
    string address
  }

  PRODUCTS {
    int id PK
    string name
    string description
    float old_price
    float price
    int quantity
    int user_id FK
    int category_id FK
  }

  CATEGORIES {
    int id PK
    string name
  }

  FILES {
    int id PK
    string name
    string path
    int product_id FK
  }

  ORDERS {
    int id PK
    string status
    int user_id FK
    int product_id FK
    int quantity
    float total
  }

  USERS ||..o{ PRODUCTS : "possui"
  CATEGORIES ||--o{ PRODUCTS : "categoriza"
  PRODUCTS ||--o{ FILES : "tem"
  USERS ||--o{ ORDERS : "realiza"
  PRODUCTS ||--o{ ORDERS : "faz parte de"
```

### 5.3. Diagrama de Sequência — Processo de Compra

```mermaid
sequenceDiagram
  participant Cliente
  participant Frontend
  participant Backend
  participant Banco

  Cliente->>Frontend: Adiciona produtos ao carrinho
  Cliente->>Frontend: Clica em "Finalizar Compra"
  Frontend->>Backend: Envia dados do pedido
  Backend->>Banco: Cria pedido e atualiza estoque
  Banco-->>Backend: Confirmação
  Backend-->>Frontend: Retorna confirmação da compra
  Frontend-->>Cliente: Exibe resumo e status do pedido
```

### 5.4. Fluxograma de Navegação

```mermaid
flowchart TD
    A[Início] --> B{Usuário Logado?}
    B -- Não --> C[Navega pelos Produtos]
    C --> D{Deseja Cadastrar?}
    D -- Sim --> E[Tela de Cadastro]
    D -- Não --> C

    B -- Sim --> F[Tela de Produtos]
    F --> G[Adicionar ao Carrinho]
    G --> H[Ver Carrinho]
    H --> I{Finalizar Compra?}
    I -- Sim --> J[Preencher Dados de Pagamento]
    J --> K[Confirmação do Pedido]
    K --> L[Fim]
    I -- Não --> F
```

---

## 6. Considerações Finais

Este documento visa orientar o desenvolvimento, manutenção e evolução da aplicação **Launchstore**, garantindo clareza nos requisitos e no entendimento da estrutura do sistema.
