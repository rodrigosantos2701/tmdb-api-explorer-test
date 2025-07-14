# 🎬 TMDB Explorer

Uma aplicação de exploração de filmes construída com Next.js, TypeScript e Tailwind CSS, seguindo a arquitetura MVVM (Model-View-ViewModel).

## 🚀 Como Iniciar a Aplicação

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Chave da API do TMDB** (The Movie Database)

### 1. Clone e Instale
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd tmdb-api-explorer-test

# Instale as dependências
npm install
```

### 2. Configure a API
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local e adicione sua chave da API
NEXT_PUBLIC_TMDB_API_TOKEN=sua_chave_api_aqui
```

> 💡 **Como obter a chave da API:**
> 1. Acesse [TMDB](https://www.themoviedb.org/)
> 2. Crie uma conta gratuita
> 3. Vá em Configurações → API → Solicitar chave de API
> 4. Escolha "Desenvolvedor" e preencha o formulário

### 3. Execute a Aplicação
```bash
# Modo desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:3000
```

### 4. Comandos Disponíveis
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Verifica código com ESLint
npm run test     # Inicia test
```

## 🏗️ Arquitetura MVVM

A aplicação segue o padrão **MVVM (Model-View-ViewModel)** para separar responsabilidades e facilitar manutenção.

### 📋 Visão Geral da Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      VIEW       │◄──►│   VIEW MODEL    │◄──►│     MODEL       │
│   (Components)  │    │    (Hooks)      │    │  (Services)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estrutura de Pastas e Camadas

```

src/
├── app/                    # 🖼️  VIEW - Páginas Next.js
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Estilos globais
│
├── components/             # 🖼️  VIEW - Componentes React
│   ├── MovieCard.tsx      # Card de filme
│   ├── MovieSection.tsx   # Seção de filmes
│   ├── MovieModal.tsx     # Modal de detalhes
│   ├── SearchBar.tsx      # Barra de busca
│   └── LoadingSpinner.tsx # Componentes de UI
│
├── hooks/                  # 🔧 VIEW MODEL - Lógica de Estado
│   ├── useMovies.ts       # Hook de filmes populares
│   ├── useMovieSearch.ts  # Hook de busca
│   └── useDebounce.ts     # Hook de debounce
│
├── services/               # 📊 MODEL - Camada de Dados
│   ├── tmdb-api.ts        # Configuração Axios
│   └── movie.service.ts   # Serviços de filmes
│
├── types/                  # 📝 MODEL - Definições de Tipos
│   └── movie.ts           # Interfaces e tipos
│
└── public/                 # 🎨 Recursos Estáticos
    └── placeholder-movie.svg
```

## 🎯 Divisão das Camadas MVVM

### 🖼️ **VIEW (Interface do Usuário)**

**Localização:** `src/app/` e `src/components/`

**Responsabilidades:**

- Renderização de componentes React
- Exibição de dados para o usuário
- Captura de eventos de interação
- Apresentação visual (CSS/Tailwind)

### 🔧 **VIEW MODEL (Lógica de Estado)**

**Localização:** `src/hooks/`

**Responsabilidades:**

- Gerenciamento de estado local
- Lógica de negócio da UI
- Comunicação entre View e Model
- Transformação de dados para exibição

### 📊 **MODEL (Camada de Dados)**

**Localização:** `src/services/` e `src/types/`

**Responsabilidades:**

- Comunicação com APIs externas
- Definição de estruturas de dados
- Lógica de negócio pura
- Cache e persistência de dados

## 🔧 Tecnologias Utilizadas

- **⚛️ React 19** - Biblioteca de interface
- **📦 Next.js 15** - Framework React
- **🏷️ TypeScript** - Tipagem estática
- **🎨 Tailwind CSS** - Estilização
- **📡 Axios** - Cliente HTTP
- **🎬 TMDB API** - Dados de filmes

## 🌟 Funcionalidades

- 🔍 **Busca com debounce** - Busca inteligente com delay
- ♾️ **Scroll infinito** - Carregamento automático
- 📱 **Design responsivo** - Funciona em todos os dispositivos
- 📊 **Modal de detalhes** - Informações completas dos filmes


