# 🎮 Novo GameStore Angular

E-commerce completo de jogos desenvolvido com Angular 18 e Node.js, otimizado para deploy no Vercel.

## 📋 Sobre o Projeto

O **Novo GameStore Angular** é uma aplicação de e-commerce moderna e responsiva para venda de jogos digitais. 

### Frontend
- **Angular 18** - Framework principal
- **Angular Material** - Componentes UI
- **ngx-translate** - Internacionalização
- **RxJS** - Programação reativa
- **TypeScript** - Linguagem de programação

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Multer** - Upload de arquivos

### Deploy e DevOps
- **Vercel** - Plataforma de deploy
- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes

## 📁 Estrutura do Projeto

```
novo-gamestore-angular/
├── 📁 frontend/          # Aplicação Angular
│   ├── 📁 src/
│   │   ├── 📁 app/       # Componentes e páginas
│   │   ├── 📁 assets/    # Recursos estáticos
│   │   └── 📄 index.html
│   ├── 📄 angular.json
│   └── 📄 package.json
├── 📁 api/              # Backend Node.js
│   ├── 📁 src/          # Código fonte da API
│   ├── 📁 prisma/       # Schema e migrações
│   ├── 📄 index.js      # Serverless function
│   └── 📄 package.json
├── 📄 vercel.json       # Configuração do Vercel
├── 📄 .vercelignore     # Arquivos ignorados no deploy
├── 📄 package.json      # Scripts do monorepo
└── 📄 README.md
```

##  Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/hebrones/novo-gamestore-angular.git
cd novo-gamestore-angular
```

### 2. Instale as dependências
```bash
# Instalar dependências de todo o projeto
npm run install:all
```

### 3. Configuração do ambiente
```bash
# Configure as variáveis de ambiente na pasta api
cp api/.env.example api/.env
```

### 4. Execute o projeto

#### Desenvolvimento (Frontend + API)
```bash
npm run dev
```

#### Apenas Frontend
```bash
npm run dev:frontend
# ou
cd frontend && npm start
```

#### Apenas API
```bash
npm run dev:api
# ou
cd api && npm run dev
```

## 🌐 Deploy no Vercel



### 2. Configurações automáticas
O Vercel detectará automaticamente:
-  Framework: Angular
-  Build Command: `npm run build`
-  Output Directory: `frontend/dist/app`
-  API Routes: `/api/*`


## 👨‍💻 Autor

**hebrones**
- GitHub: [@hebrones](https://github.com/hebrones)
- Repositório: [novo-gamestore-angular](https://github.com/hebrones/novo-gamestore-angular)


