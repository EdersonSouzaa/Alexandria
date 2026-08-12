# ALEXANDRIA

Plataforma web para organizar leituras, montar uma biblioteca pessoal digital e acompanhar a jornada do leitor — inspirada na ideia da antiga Biblioteca de Alexandria, com uma coruja como mascote/logo.

## O que é o Alexandria

ALEXANDRIA é um "Goodreads" pessoal, gratuito e em português: um lugar para organizar o que você lê sem depender de uma base de dados fechada ou paga. Em vez de cadastrar livros manualmente, o catálogo inteiro vem de uma fonte aberta — a **Open Library**, mantida pelo Internet Archive — então qualquer pessoa pode começar a usar o app sem nenhuma configuração extra.

**Objetivo principal**: dar ao leitor um espaço só dele para registrar o que está lendo, o que já leu e o que quer ler a seguir, escrever avaliações de verdade (nota + resenha), trocar ideias com outros leitores em uma comunidade simples, e se sentir recompensado por isso através de um sistema de XP, níveis e conquistas — tudo em uma interface pensada para parecer uma biblioteca, não uma planilha.

É uma aplicação full-stack (React + Node.js), estruturada como monorepo com frontend e backend publicados separadamente.

## Funcionalidades

### Conta e autenticação
- Cadastro e login de usuários com autenticação via JWT (token stateless, expira em 24h).
- Perfil do usuário com consulta e edição de dados.
- Isolamento total de dados entre contas diferentes (cada usuário só acessa seus próprios registros).

### Descoberta e catálogo de livros
- Lista inicial com os 100 livros em alta (trending) da Open Library ao abrir a tela Explorar, sem precisar buscar nada.
- Pesquisa de livros usando a Open Library API, intermediada pelo backend (filtros por termo, categoria, ordenação e qualidade do resultado, com paginação).
- Cache de buscas, tendências e detalhes de livros (em memória, TTL de 60 min) para reduzir chamadas repetidas à API da Open Library.
- Tela de detalhes do livro com capa, autor, descrição, categoria, editora, data de publicação e número de páginas (quando a Open Library fornece o dado), além de nota média calculada a partir das avaliações reais da comunidade para aquele livro.
- Ação rápida de adicionar à biblioteca, favoritar e copiar o link do livro direto da tela de detalhes.
- Página inicial (landing page) pública com busca rápida, cards de destaque e apresentação do produto.

### Biblioteca pessoal
- Adição de livros à biblioteca pessoal.
- Status de leitura por livro: **quero ler**, **lendo**, **lido** e **abandonado** — editável tanto na estante quanto direto na tela do livro.
- Marcação de livros como favoritos.
- Remoção de livros da biblioteca.

### Avaliações
- Avaliações com nota de 1 a 5 estrelas e resenha em texto (até 5000 caracteres).
- Edição, exclusão e listagem das avaliações do usuário logado, com estatísticas (total de avaliações, nota média, palavras escritas) e exportação em CSV.
- Na própria tela do livro, uma seção de **avaliações da comunidade** mostra o que outros leitores escreveram sobre aquele título específico, com curtidas e destaque para a sua própria avaliação (com opção de editar ou excluir).

### Comunidade
- Feed de comunidade com publicações, curtidas e comentários.
- Publicação automática no feed sempre que uma avaliação é criada (integração cruzada entre os módulos de Avaliações e Comunidade), que também alimenta a seção de avaliações da tela de cada livro.

### Gamificação
- Sistema de XP, níveis e conquistas persistido por usuário.
- Histórico de atividades e estatísticas agregadas (total de livros, lidos, avaliações, favoritos, posts, abandonados, quero-ler, lendo).
- Notificação visual (toast) ao ganhar XP.

### Confiabilidade
- Endpoint de health check público (`/api/health`) para monitoramento de disponibilidade (usado pela Railway).

## Como o Alexandria usa a Open Library API

A [Open Library](https://openlibrary.org/developers/api) (mantida pelo Internet Archive) é a **única** fonte de dados de livros do projeto. É uma API pública e totalmente gratuita: não exige cadastro nem chave de API — a única exigência de boas práticas é identificar as requisições com um header `User-Agent`, o que já vem pronto em `backend/src/services/openLibraryService.js`.

Todo o consumo passa pelo backend — o frontend nunca chama `openlibrary.org` diretamente. Isso permite cachear respostas, esconder os detalhes da API externa do cliente, e deixa aberta a possibilidade de trocar de fonte de dados no futuro sem mexer no frontend.

Passo a passo de como cada tela usa a API:

1. **Descoberta sem busca (tela Explorar)** — ao abrir `/explorar` sem digitar nada, o frontend chama `GET /api/livros/tendencias`. O backend faz uma requisição a `GET https://openlibrary.org/trending/daily.json`, que devolve os 100 livros mais acessados no Internet Archive nas últimas 24h, e converte cada item para o formato interno do app (`identificadorExterno`, `titulo`, `autor`, `capa`, `categoria`, `dataPublicacao`).
2. **Busca por termo/categoria** — ao digitar um termo ou escolher uma categoria, o frontend chama `GET /api/livros/buscar`. O backend monta a query e chama `GET https://openlibrary.org/search.json`, com suporte a paginação (`offset`/`limit`), ordenação (`sort=new` para "mais recentes") e um filtro de qualidade mínima (prioriza livros com capa disponível).
3. **Detalhe de um livro** — ao abrir `/livros/:id`, o frontend chama `GET /api/livros/openlibrary/:id`. O backend busca `GET https://openlibrary.org/works/:id.json` para título, descrição, assuntos e IDs de capa, e complementa com o(s) nome(s) do(s) autor(es) chamando `GET https://openlibrary.org/authors/:authorId.json` — a Open Library só devolve a *chave* do autor dentro da obra, não o nome, então esse passo extra é necessário.
4. **Capas** — as imagens nunca passam pelo backend: o app só monta a URL pública `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg` e deixa o navegador do usuário carregar a capa direto do CDN da Open Library.
5. **Cache** — toda resposta (tendências, buscas e detalhes) passa por um cache em memória com TTL de 60 minutos (`backend/src/lib/cache.js`), reduzindo chamadas repetidas à Open Library e deixando a navegação mais rápida.
6. **Cópia local mínima** — só quando o usuário efetivamente adiciona um livro à biblioteca ou o avalia, o app cria um registro local mínimo dele na tabela `livros` (função `obterOuCriarLivroLocal`), usando a *work key* da Open Library (ex.: `OL21745884W`) como identificador externo único. Buscas e listagens continuam sempre usando os dados "ao vivo" da API — o registro local existe só para sustentar relações internas (biblioteca, avaliações, posts).

## Principais telas

Um resumo rápido de três telas centrais do app:

### Início

Painel de entrada do app: destaca o livro que você está lendo no momento (ou sugere começar um, se a estante estiver vazia), com atalhos rápidos para buscar livros, ver a estante e a comunidade, além de um resumo do que está "Lendo atualmente" e do seu progresso de nível/XP na barra lateral.

![Tela Início do Alexandria](frontend/src/assets/img_um.png)

### Explorar

Catálogo de descoberta ligado direto na Open Library: mostra os livros em alta assim que a tela abre, com filtros por categoria e ordenação, e permite adicionar qualquer resultado à biblioteca pessoal com um clique — sem sair da tela de busca.

![Tela Explorar do Alexandria](frontend/src/assets/img_dois.png)

### Conquistas

Painel de gamificação: nível atual e XP até o próximo nível, o título de leitor desbloqueado (ex.: "Leitor Iniciante"), e estatísticas agregadas de toda a jornada — livros na biblioteca, lidos, avaliações, favoritos, publicações na comunidade, quero ler, lendo agora e abandonados.

![Tela Conquistas do Alexandria](frontend/src/assets/img_tres.png)

## Estilo de design

O produto tem dois temas visuais coerentes entre si, compartilhando a mesma identidade (serifada para títulos, coruja como mascote), mas aplicados a contextos diferentes:

**Páginas públicas** (landing, login, cadastro) — tema **dark mode**, paleta "céu noturno":

| Token | Cor | Uso |
|---|---|---|
| `--dark-navy` | `#0a192f` | Fundo principal |
| `--navy` | `#112240` | Fundo de cards/seções |
| `--light-navy` | `#1d2d44` | Camadas de destaque |
| `--slate` | `#8892b0` | Texto secundário |
| `--light-slate` | `#ccd6f6` | Texto principal |
| `--cyan` | `#64ffda` | Cor de destaque/marca (botões, links, seleção de texto) |
| `--danger` | `#ff7b72` | Erros e ações destrutivas |

**Área logada** (Início, Explorar, Biblioteca, Avaliações, Comunidade, Conquistas, tela do livro) — tema **claro**, fundo cor de pergaminho com acentos em azul-marinho e dourado:

| Token | Cor | Uso |
|---|---|---|
| `--dash-surface` | `#fef9ed` | Fundo principal (efeito "papel") |
| `--dash-primary` | `#001524` | Azul-marinho — títulos, cards de destaque, botões primários |
| `--dash-secondary` | `#366572` | Teal — links e textos de apoio |
| `--dash-tertiary-fixed-dim` | `#e9c176` | Dourado — badges, estrelas, botões de destaque |
| `--dash-outline` | `#73777d` | Texto terciário / bordas |

Outros pontos do design:
- **Tipografia**: títulos em **Playfair Display** (serifada, remete a um livro impresso), corpo de texto em **Inter**, com peso alto e letter-spacing negativo nos títulos das páginas públicas.
- **Botões**: formato pílula (`border-radius: 999px`) nas ações primárias da área logada, com leve elevação (`translateY`) no hover.
- **Cards e capas**: sombras suaves em camadas (`shadow-sm/md/lg`) para dar profundidade sem parecer pesado; capas de livro sempre em proporção 2:3, com um efeito de carregamento (shimmer) enquanto a imagem da Open Library chega.
- **Identidade visual**: a coruja aparece de duas formas — como ilustração SVG grande (`OwlLogo`) na landing page, e como logo (`logo.png`) no cabeçalho/barra lateral da área logada, ao lado do wordmark "Alexandria".
- **Layout**: cards em grid para destaques e vitrines de livros, rótulos "kicker" acima de títulos — um estilo de landing page de produto SaaS aplicado ao conceito de biblioteca digital.
- **CSS**: escrito à mão, sem framework de utilitários (sem Tailwind) nem CSS-in-JS — variáveis de tema por contexto (`global.css` para o tema escuro público, `dashboard.css` para o tema claro logado) e um arquivo de estilo por página/componente.

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
- Cache em memória com TTL (60 min) para buscas, tendências e detalhes de livros, implementado à mão (`src/lib/cache.js`).
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
| `authRoutes` | `/api/auth` | Registro, login, perfil |
| `livroRoutes` | `/api/livros` | Em alta (`/tendencias`), busca (`/buscar`) e detalhe (`/openlibrary/:id`) via Open Library |
| `bibliotecaRoutes` | `/api/biblioteca` | Adicionar/listar/remover livros, status de leitura, favoritos |
| `avaliacaoRoutes` | `/api/avaliacoes` | CRUD de avaliações (nota + resenha) + export CSV |
| `comunidadeRoutes` | `/api/comunidade/posts` | Posts, curtidas, comentários — com filtro opcional por livro (`?livro=identificadorExterno`), usado pela seção de avaliações da tela do livro |
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
| `comunidade_posts` | usuario_id, livro_id, avaliacao_id, conteudo | Post do feed (gerado a partir de uma avaliação); é a fonte das avaliações mostradas na tela de cada livro |
| `comunidade_curtida` | usuario_id, post_id | Curtida (toggle) |
| `comunidade_comentario` | usuario_id, post_id, conteudo | Comentário em post |
| `gamificacao` | usuario_id (1:1), xp, conquistas_desbloqueadas (JSON), historico (JSON), contadores agregados | XP, conquistas e histórico armazenados como JSON em colunas TEXT |

Migrações versionadas via Prisma (`prisma migrate`), com histórico em `backend/prisma/migrations/`.

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

Nenhuma variável adicional é necessária para o catálogo de livros funcionar: a Open Library é pública e não exige chave de API.

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
4. Na tela Início, ver os livros em alta sugeridos ou ir até a aba Explorar.
5. Pesquisar um livro na aba Explorar (ou pegar um da lista de tendências).
6. Abrir os detalhes e adicionar o livro à biblioteca.
7. Alterar status de leitura e marcar como favorito direto na tela do livro.
8. Criar uma avaliação com nota e resenha — ela aparece na seção "Avaliações da comunidade" da tela do próprio livro.
9. Abrir Minhas avaliações e testar edição/exportação CSV.
10. Abrir Comunidade e confirmar a publicação automática da avaliação.
11. Curtir e comentar uma publicação (na Comunidade ou direto no card de avaliação da tela do livro).
12. Abrir Conquistas e verificar XP, nível e histórico.
13. Entrar com outra conta para demonstrar isolamento de dados.
