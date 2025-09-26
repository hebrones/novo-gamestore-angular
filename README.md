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

## 🚀 Deploy

Este projeto está configurado para deploy em duas plataformas:
- **Frontend**: Vercel (Angular)
- **Backend**: Render (Node.js/Express/Prisma)

### 📦 Backend (Render)

1. **Conectar repositório na Render**
   - Acesse [render.com](https://render.com)
   - Conecte seu repositório GitHub
   - Selecione "Blueprint" para usar o arquivo `render.yaml`

2. **Configurar variáveis de ambiente**
   - Após o primeiro deploy, acesse o painel da Render
   - Configure `FRONT_ORIGIN` com o domínio do Vercel (ex: `https://seu-site.vercel.app`)
   - As outras variáveis são configuradas automaticamente pelo `render.yaml`

3. **Verificar deploy**
   - Aguarde o deploy completar
   - Anote a URL pública (ex: `https://gamestore-api.onrender.com`)
   - O comando `npm run prisma:seed` roda automaticamente após o deploy

### 🌐 Frontend (Vercel)

1. **Configurar projeto no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório GitHub
   - Configure:
     - **Root Directory**: `.` (raiz do repositório)
     - **Install Command**: `npm run install:all`
     - **Build Command**: `npm run build:front`
     - **Output Directory**: `frontend/dist/app`

2. **Atualizar URL da API**
   - Após o deploy da API na Render, edite `frontend/src/app/core/env.ts`
   - Substitua `https://SEU-SERVICE.onrender.com` pela URL real da API
   - Faça commit e push para redeploy automático

### 🔧 Smoke Tests

Após os deploys, teste os endpoints principais:

#### API (Render)
```bash
# Health check
GET https://sua-api.onrender.com/health
# Resposta esperada: { "ok": true }

# Lista de produtos
GET https://sua-api.onrender.com/products
# Resposta esperada: Array com 10 jogos
```

#### Frontend (Vercel)
- Acesse sua aplicação no Vercel
- Verifique se a página inicial carrega
- Teste se os produtos são listados corretamente
- Confirme que as imagens dos jogos aparecem

## ⚙️ Configuração do Projeto no Vercel

**IMPORTANTE**: No painel do Vercel, configure:

### Project Settings → General
- **Root Directory**: `frontend`

### Build & Output Settings
- **Install Command**: (deixar vazio)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/app`

Essas configurações são necessárias porque:
- O projeto Angular está na pasta `frontend/`
- O build gera arquivos em `frontend/dist/app/`
- O `frontend/vercel.json` configura o SPA fallback

### 📝 Variáveis de Ambiente

#### API (.env)
```env
DATABASE_URL="file:./dev.db"
PORT=3333
JWT_SECRET="troque_isso"
FRONT_ORIGIN="https://seu-site.vercel.app"
```

#### Frontend
A URL da API é configurada em `frontend/src/app/core/env.ts`

## 👨‍💻 Autor

**hebrones**
- GitHub: [@hebrones](https://github.com/hebrones)
- Repositório: [novo-gamestore-angular](https://github.com/hebrones/novo-gamestore-angular)


