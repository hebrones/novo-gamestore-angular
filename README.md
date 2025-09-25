# Game Store - Angular Monorepo

Uma aplicação completa de e-commerce para jogos desenvolvida com Angular e Node.js.

## Configuração da API

```bash
cd api
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev  # Servidor rodará em http://localhost:3333
```

### Credenciais de Teste
- Administrador: `admin@local.com` / `Admin@123`
- Usuário: `user@local.com` / `User@123`

## Configuração do Frontend

```bash
cd frontend
npm install
npm start  # Aplicação rodará em http://localhost:4200
```

## Funcionalidades

### Catálogo de Produtos
- Exibição de jogos com imagem, título, preço e descrição
- Carregamento otimizado com lazy loading
- Filtros e busca por produtos

### Sistema de Autenticação
- Login e cadastro de usuários
- Controle de acesso baseado em roles (Admin/User)
- Proteção de rotas com guards
- Interceptor para autenticação JWT

### Gerenciamento de Produtos (Admin)
- Adicionar novos produtos
- Editar produtos existentes
- Remover produtos com confirmação
- Upload de imagens com preview

### Carrinho de Compras
- Adicionar/remover itens do carrinho
- Persistência no localStorage
- Processo de checkout completo
- Controle de estoque automático

### Internacionalização
- Suporte para Português e Inglês
- Alternância de idioma no header
- Configurações persistidas

### API Backend
- RESTful API com Express.js
- Banco de dados SQLite com Prisma ORM
- Upload de arquivos com Multer
- Validação e tratamento de erros

## Tecnologias Utilizadas

- **Frontend**: Angular, TypeScript, Angular Material
- **Backend**: Node.js, Express.js, Prisma, SQLite
- **Autenticação**: JWT
- **Upload**: Multer
- **Estilização**: CSS3, Angular Material

## Estrutura do Projeto

```
gamestore-angular-monorepo/
├── api/                 # Backend Node.js
│   ├── src/            # Código fonte da API
│   ├── prisma/         # Schema e migrações do banco
│   └── uploads/        # Imagens dos produtos
└── frontend/           # Frontend Angular
    └── src/           # Código fonte da aplicação
```
