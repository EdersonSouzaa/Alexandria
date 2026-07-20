-- =====================================================================
-- ALEXANDRIA — Schema completo do banco de dados (PostgreSQL / Supabase)
--
-- Gerado a partir de:
--   backend/prisma/schema.prisma
--   backend/prisma/migrations/20260713235314_init/migration.sql
--
-- Como usar:
--   1. Abra o painel do seu projeto em https://supabase.com/dashboard
--   2. Vá em "SQL Editor" > "New query"
--   3. Cole todo o conteúdo deste arquivo e clique em "Run"
--
-- Depois de rodar isso manualmente no Supabase, avise o Prisma que a
-- migration "20260713235314_init" já foi aplicada (rode isso no seu
-- terminal, dentro da pasta backend/, com DATABASE_URL apontando pro
-- Supabase):
--   npx prisma migrate resolve --applied 20260713235314_init
-- Isso evita que `prisma migrate deploy` tente recriar as tabelas.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- Enum: status de leitura de um livro na biblioteca do usuário
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'StatusLeitura') then
    create type "StatusLeitura" as enum ('QUERO_LER', 'LENDO', 'LIDO', 'ABANDONADO');
  end if;
end
$$;

-- ---------------------------------------------------------------------
-- Tabela: users — contas de usuário / autenticação
-- ---------------------------------------------------------------------
create table if not exists "users" (
    "id" serial not null,
    "name" text not null,
    "email" text not null,
    "password" text not null,
    "reset_password_token" text,
    "reset_password_expiry" timestamp(3),
    "criado_em" timestamp(3) not null default current_timestamp,

    constraint "users_pkey" primary key ("id")
);

create unique index if not exists "users_email_key" on "users"("email");
create unique index if not exists "users_reset_password_token_key" on "users"("reset_password_token");

-- ---------------------------------------------------------------------
-- Tabela: livros — cache local dos livros vindos da Google Books API
-- ---------------------------------------------------------------------
create table if not exists "livros" (
    "id" serial not null,
    "identificador_externo" text not null,
    "titulo" text not null,
    "autor" text,
    "descricao" text,
    "capa" text,
    "editora" text,
    "data_publicacao" text,
    "categoria" text,
    "numero_paginas" integer,

    constraint "livros_pkey" primary key ("id")
);

create unique index if not exists "livros_identificador_externo_key" on "livros"("identificador_externo");

-- ---------------------------------------------------------------------
-- Tabela: biblioteca — livros que cada usuário adicionou à própria biblioteca
-- ---------------------------------------------------------------------
create table if not exists "biblioteca" (
    "id" serial not null,
    "usuario_id" integer not null,
    "livro_id" integer not null,
    "status_leitura" "StatusLeitura" not null default 'QUERO_LER',
    "favorito" boolean not null default false,
    "criado_em" timestamp(3) not null default current_timestamp,
    "atualizado_em" timestamp(3) not null,

    constraint "biblioteca_pkey" primary key ("id"),
    constraint "biblioteca_usuario_id_fkey" foreign key ("usuario_id") references "users"("id") on delete cascade on update cascade,
    constraint "biblioteca_livro_id_fkey" foreign key ("livro_id") references "livros"("id") on delete restrict on update cascade
);

create unique index if not exists "biblioteca_usuario_id_livro_id_key" on "biblioteca"("usuario_id", "livro_id");

-- ---------------------------------------------------------------------
-- Tabela: avaliacoes — nota (1-5) e resenha de um usuário sobre um livro
-- ---------------------------------------------------------------------
create table if not exists "avaliacoes" (
    "id" serial not null,
    "usuario_id" integer not null,
    "livro_id" integer not null,
    "nota" integer not null,
    "resenha" text not null,
    "criado_em" timestamp(3) not null default current_timestamp,
    "atualizado_em" timestamp(3) not null,

    constraint "avaliacoes_pkey" primary key ("id"),
    constraint "avaliacoes_usuario_id_fkey" foreign key ("usuario_id") references "users"("id") on delete cascade on update cascade,
    constraint "avaliacoes_livro_id_fkey" foreign key ("livro_id") references "livros"("id") on delete restrict on update cascade
);

create unique index if not exists "avaliacoes_usuario_id_livro_id_key" on "avaliacoes"("usuario_id", "livro_id");

-- ---------------------------------------------------------------------
-- Tabela: comunidade_posts — posts do feed (gerados a partir de uma avaliação)
-- ---------------------------------------------------------------------
create table if not exists "comunidade_posts" (
    "id" serial not null,
    "usuario_id" integer not null,
    "livro_id" integer,
    "avaliacao_id" integer,
    "conteudo" text not null,
    "criado_em" timestamp(3) not null default current_timestamp,

    constraint "comunidade_posts_pkey" primary key ("id"),
    constraint "comunidade_posts_usuario_id_fkey" foreign key ("usuario_id") references "users"("id") on delete cascade on update cascade,
    constraint "comunidade_posts_livro_id_fkey" foreign key ("livro_id") references "livros"("id") on delete set null on update cascade,
    constraint "comunidade_posts_avaliacao_id_fkey" foreign key ("avaliacao_id") references "avaliacoes"("id") on delete set null on update cascade
);

create unique index if not exists "comunidade_posts_avaliacao_id_key" on "comunidade_posts"("avaliacao_id");

-- ---------------------------------------------------------------------
-- Tabela: comunidade_curtida — curtidas (toggle) em posts
-- ---------------------------------------------------------------------
create table if not exists "comunidade_curtida" (
    "id" serial not null,
    "usuario_id" integer not null,
    "post_id" integer not null,
    "criado_em" timestamp(3) not null default current_timestamp,

    constraint "comunidade_curtida_pkey" primary key ("id"),
    constraint "comunidade_curtida_usuario_id_fkey" foreign key ("usuario_id") references "users"("id") on delete cascade on update cascade,
    constraint "comunidade_curtida_post_id_fkey" foreign key ("post_id") references "comunidade_posts"("id") on delete cascade on update cascade
);

create unique index if not exists "comunidade_curtida_usuario_id_post_id_key" on "comunidade_curtida"("usuario_id", "post_id");

-- ---------------------------------------------------------------------
-- Tabela: comunidade_comentario — comentários em posts
-- ---------------------------------------------------------------------
create table if not exists "comunidade_comentario" (
    "id" serial not null,
    "usuario_id" integer not null,
    "post_id" integer not null,
    "conteudo" varchar(1000) not null,
    "criado_em" timestamp(3) not null default current_timestamp,

    constraint "comunidade_comentario_pkey" primary key ("id"),
    constraint "comunidade_comentario_usuario_id_fkey" foreign key ("usuario_id") references "users"("id") on delete cascade on update cascade,
    constraint "comunidade_comentario_post_id_fkey" foreign key ("post_id") references "comunidade_posts"("id") on delete cascade on update cascade
);

-- ---------------------------------------------------------------------
-- Tabela: gamificacao — XP, conquistas e estatísticas agregadas (1:1 com users)
-- ---------------------------------------------------------------------
create table if not exists "gamificacao" (
    "id" serial not null,
    "usuario_id" integer not null,
    "xp" integer not null default 0,
    "conquistas_desbloqueadas" text not null default '[]',
    "historico" text not null default '[]',
    "total_livros" integer not null default 0,
    "total_lidos" integer not null default 0,
    "total_avaliacoes" integer not null default 0,
    "total_favoritos" integer not null default 0,
    "total_posts" integer not null default 0,
    "total_abandonados" integer not null default 0,
    "total_quero_ler" integer not null default 0,
    "total_lendo" integer not null default 0,

    constraint "gamificacao_pkey" primary key ("id"),
    constraint "gamificacao_usuario_id_fkey" foreign key ("usuario_id") references "users"("id") on delete cascade on update cascade
);

create unique index if not exists "gamificacao_usuario_id_key" on "gamificacao"("usuario_id");

commit;
