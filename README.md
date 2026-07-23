# ALEXANDRIA

Plataforma web para organizar leituras, montar uma biblioteca pessoal digital e acompanhar a jornada do leitor — inspirada na ideia da antiga Biblioteca de Alexandria, com uma coruja como mascote/logo.

## Sobre o projeto

O ALEXANDRIA é uma aplicação full-stack (React + Node.js) que funciona como um "Goodreads" pessoal: o usuário pesquisa livros através da Open Library API, salva os que quiser em uma biblioteca própria, controla o status de leitura de cada obra, escreve avaliações com nota e resenha, participa de uma comunidade interna de leitores e evolui em um sistema de gamificação (XP, níveis e conquistas) conforme usa o app.

Todo o produto — interface, textos e domínio de dados — é em português (pt-BR), com foco em um público leitor brasileiro. O projeto está estruturado como um monorepo com duas aplicações independentes, publicadas separadamente na Railway:

- **Frontend**: https://frontend-production-afa3.up.railway.app
- **Backend**: https://backend-production-ddd2.up.railway.app
- **Health check da API**: https://backend-production-ddd2.up.railway.app/api/health

> Observação: abrir a URL raiz do backend diretamente pode retornar acesso negado, pois a maior parte da API exige autenticação JWT. Para verificar disponibilidade, use o endpoint `/api/health`.

## Funcionalidades

### Conta e autenticação
- Cadastro e login de usuários com autenticação via JWT (token stateless, expira em 24h).
- Recuperação de senha por token temporário (esqueci a senha / redefinir senha). Em ambiente de desenvolvimento, sem provedor de e-mail configurado, o token é retornado na resposta da API e logado no backend — ver `backend/.env.example`.
- Perfil do usuário com consulta e edição de dados.
- Isolamento total de dados entre contas diferentes (cada usuário só acessa seus próprios registros).

### Descoberta e catálogo de livros
- Lista inicial com os 100 livros em alta (trending) da Open Library ao abrir a tela Explorar, sem precisar buscar nada.
- Pesquisa de livros usando a Open Library API, intermediada pelo backend (filtros por termo, categoria, ordenação e qualidade do resultado, com paginação).
- Cache de buscas e detalhes de livros (em memória, TTL de 60 min) para reduzir chamadas repetidas à API da Open Library.
- Tela de detalhes do livro com capa, autor, descrição, editora, data de publicação e número de páginas.
- Página inicial (landing page) pública com busca rápida, cards de destaque e apresentação do produto.

### Biblioteca pessoal
- Adição de livros à biblioteca pessoal.
- Status de leitura por livro: **quero ler**, **lendo**, **lido** e **abandonado**.
- Marcação de livros como favoritos.
- Remoção de livros da biblioteca.

### Avaliações
- Avaliações com nota de 1 a 5 estrelas e resenha em texto (até 5000 caracteres).
- Edição, exclusão e listagem das avaliações do usuário logado.
- Exportação das avaliações em CSV.

### Comunidade
- Feed de comunidade com publicações, curtidas e comentários.
- Publicação automática no feed sempre que uma avaliação é criada (integração cruzada entre os módulos de Avaliações e Comunidade).

### Gamificação
- Sistema de XP, níveis e conquistas persistido por usuário.
- Histórico de atividades e estatísticas agregadas (total de livros, lidos, avaliações, favoritos, posts, abandonados, quero-ler, lendo).
- Notificação visual (toast) ao ganhar XP.

### Confiabilidade
- Endpoint de health check público (`/api/health`) para monitoramento de disponibilidade (usado pela Railway).

## Estilo de design

O visual segue um tema **dark mode** único (sem alternância para modo claro), com uma paleta "céu noturno" que remete a uma biblioteca à noite:

| Token | Cor | Uso |
|---|---|---|
| `--dark-navy` | `#0a192f` | Fundo principal |
| `--navy` | `#112240` | Fundo de cards/seções |
| `--light-navy` | `#1d2d44` | Camadas de destaque |
| `--slate` | `#8892b0` | Texto secundário |
| `--light-slate` | `#ccd6f6` | Texto principal |
| `--cyan` | `#64ffda` | Cor de destaque/marca (botões, links, seleção de texto) |
| `--danger` | `#ff7b72` | Erros e ações destrutivas |

Outros pontos do design:
- **Tipografia**: fonte Inter, títulos com peso alto e letter-spacing negativo para um visual moderno e condensado.
- **Fundo**: gradientes radiais (brilho ciano) sobre gradiente linear navy, criando profundidade sem uso de sombras pesadas.
- **Botões**: bordas bem arredondadas (14px), altura mínima generosa, variante primária (preenchimento ciano sólido) e secundária (contorno translúcido), com leve elevação (`translateY`) no hover.
- **Identidade visual**: mascote de coruja (SVG `OwlLogo`) ao lado do wordmark "Alexandria" na navbar, reforçando a referência à biblioteca antiga. *(Placeholder provisório — pode ser substituído por uma arte final `coruja.png` depois.)*
- **Layout**: cards em grid para destaques e vitrines de livros, rótulos "kicker" acima de títulos — um estilo de landing page de produto SaaS aplicado ao conceito de biblioteca digital.
- **CSS**: escrito à mão, sem framework de utilitários (sem Tailwind) nem CSS-in-JS — um arquivo `global.css` com variáveis + um arquivo de estilo por página/componente.

## Tecnologias

### Frontend (`/frontend`)
- **React 19** com **Vite** (build tool e dev server).
- **React Router DOM v7** para roteamento, com componente `ProtectedRoute` guardando rotas autenticadas.
- **Axios** para consumo da API (uma instância base + um módulo de serviço por domínio: livros, biblioteca, avaliações, comunidade, gamificação).
- **Context API** do React para estado global (`AuthContext` para sessão/JWT, `GamificacaoContext` para XP/conquistas) — sem Redux/Zustand.
- **CSS puro** organizado por página e por componente, sem framework de estilos.
- **ESLint 9** (flat config) com plugins de React Hooks e React Refresh.
- Script customizado de deploy (`scripts/preview.mjs`) usado como `npm start` na Railway.

### Backend (`/backend`)
- **Node.js** (JavaScript puro, CommonJS) com **Express 4** para a API REST.
- Autenticação **JWT stateless** via middleware customizado (`requireAuth`), tokens assinados com `jsonwebtoken`, senhas com `bcryptjs`.
- **Prisma ORM** sobre **PostgreSQL** — schema declarativo (`prisma/schema.prisma`) e migrações versionadas (`prisma/migrations/`).
- Cache em memória com TTL (60 min) para buscas e detalhes de livros, implementado à mão (`src/lib/cache.js`).
- **Open Library API** (openlibrary.org) como única integração externa de dados — pública, sem chave de API, identificada por `User-Agent` —, consumida via `fetch` nativo do Node.
- **Zod** para validação de DTOs de requisição.
- **Test runner nativo do Node** (`node --test`) + **Supertest** para testes de rota.
- Sem filas/mensageria, sem jobs agendados, sem provedor de e-mail ou pagamento — a integração externa é só a Open Library.

### Deploy
- **Railway** hospedando frontend, backend e um PostgreSQL gerenciado.
- **GitHub** como repositório remoto.

## Arquitetura da API

API REST em JSON sob o prefixo `/api`, organizada por router de domínio (`src/routes/`):

| Router | Rota base | Responsabilidade |
|---|---|---|
| `authRoutes` | `/api/auth` | Registro, login, perfil, esqueci/redefinir senha |
| `livroRoutes` | `/api/livros` | Em alta (`/tendencias`), busca (`/buscar`) e detalhe (`/openlibrary/:id`) via Open Library |
| `bibliotecaRoutes` | `/api/biblioteca` | Adicionar/listar/remover livros, status de leitura, favoritos |
| `avaliacaoRoutes` | `/api/avaliacoes` | CRUD de avaliações (nota + resenha) + export CSV |
| `comunidadeRoutes` | `/api/comunidade/posts` | Posts, curtidas, comentários |
| `gamificacaoRoutes` | `/api/gamificacao` | Consulta de XP/conquistas/estatísticas |
| `healthRoutes` | `/api/health` | Health check público |

Apenas `/api/auth/login`, `/register`, `/forgot-password`, `/reset-password` e `/api/health` são públicos; todo o restante exige um JWT válido no header `Authorization: Bearer <token>` (verificado pelo middleware `requireAuth`).

## Modelo de dados

| Tabela | Principais campos | Observações |
|---|---|---|
| `users` | email (único), name, password (hash bcrypt), reset_password_token, reset_password_expiry | Entidade central de conta/autenticação |
| `livros` | titulo, autor, descricao, capa, identificador_externo (work key da Open Library), editora, data_publicacao, categoria, numero_paginas | Cache local dos livros vindos da Open Library |
| `biblioteca` | usuario_id, livro_id, status_leitura (enum), favorito | Único por (usuário, livro) |
| `avaliacoes` | usuario_id, livro_id, nota (1–5), resenha | Único por (usuário, livro) |
| `comunidade_posts` | usuario_id, livro_id, avaliacao_id, conteudo | Post do feed (gerado a partir de uma avaliação) |
| `comunidade_curtida` | usuario_id, post_id | Curtida (toggle) |
| `comunidade_comentario` | usuario_id, post_id, conteudo | Comentário em post |
| `gamificacao` | usuario_id (1:1), xp, conquistas_desbloqueadas (JSON), historico (JSON), contadores agregados | XP, conquistas e histórico armazenados como JSON em colunas TEXT |

Migrações versionadas via Prisma (`prisma migrate`), com histórico em `backend/prisma/migrations/`.

## Estrutura do projeto

```text
Alexandria/
  backend/    API REST em Node.js + Express + Prisma
    prisma/
      schema.prisma   Modelo de dados (tabelas, relações, enums)
      migrations/     Histórico de migrações aplicadas
    src/
      lib/            Prisma client, JWT, cache TTL, erros customizados
      middleware/      Autenticação, validação (Zod), tratamento global de erros
      schemas/         Schemas Zod de request por domínio
      services/        Regras de negócio por domínio
      routes/          Routers Express por domínio
      app.js           Configuração do Express (CORS, rotas, error handler)
      server.js        Ponto de entrada (sobe o servidor HTTP)
    test/              Testes (node --test + Supertest)
  frontend/   Aplicação web em React + Vite
    src/
      routes/       Definição de rotas e proteção de rotas
      context/      Estado global (Auth, Gamificação)
      pages/        Telas da aplicação
      components/   Componentes reutilizáveis (Navbar, Button, Input...)
      services/      Chamadas à API por domínio
      styles/        CSS global + por página/componente
```

## Como rodar localmente

### 1. Backend

Entre na pasta do backend:

```bash
cd backend
```

Copie `backend/.env.example` para `backend/.env` e preencha com seus valores:

```env
PORT=8080
DATABASE_URL=postgresql://postgres:sua_senha_local@localhost:5432/alexandria_web?schema=public
JWT_SECRET=troque_por_uma_chave_forte_com_no_minimo_32_caracteres
FRONTEND_URL=http://localhost:5173
```

> Se sua senha do Postgres tiver caracteres especiais (`@`, `!`, `#`...), faça o *URL encode* deles na `DATABASE_URL` (ex.: `@` vira `%40`).

Crie o banco `alexandria_web` no seu PostgreSQL local antes de subir a aplicação, depois instale as dependências e aplique as migrações do Prisma:

```bash
npm install
npx prisma migrate dev
```

Execute:

```bash
npm run dev
```

### 2. Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Crie `frontend/.env.local` com a URL da API:

```env
VITE_API_URL=http://localhost:8080
```

Instale as dependências e rode:

```bash
npm install
npm run dev
```

## Build e validação

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm run build
```

## Variáveis no Railway

### Backend

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL` (aceita múltiplas origens separadas por vírgula, ex.: `https://seu-app.vercel.app,https://seu-app-git-main-time.vercel.app`)

O comando de start (`npm start`) roda `prisma migrate deploy` antes de subir o servidor, aplicando migrações pendentes automaticamente no deploy.

### Frontend

- `VITE_API_URL`

Importante: chaves reais, senhas e segredos devem ficar apenas nas variáveis de ambiente da Railway ou em arquivos locais ignorados pelo Git.

## Roteiro rápido para demonstração

1. Abrir o frontend publicado (ou `localhost:5173` em dev).
2. Criar uma conta nova.
3. Fazer login.
4. Pesquisar um livro na aba Explorar.
5. Abrir os detalhes e adicionar o livro à biblioteca.
6. Alterar status de leitura e marcar como favorito.
7. Criar uma avaliação com nota e resenha.
8. Abrir Minhas avaliações e testar edição/exportação CSV.
9. Abrir Comunidade e confirmar a publicação automática da avaliação.
10. Curtir e comentar uma publicação.
11. Abrir Conquistas e verificar XP, nível e histórico.
12. Entrar com outra conta para demonstrar isolamento de dados.
