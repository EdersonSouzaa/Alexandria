-- CreateEnum
CREATE TYPE "StatusLeitura" AS ENUM ('QUERO_LER', 'LENDO', 'LIDO', 'ABANDONADO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "reset_password_token" TEXT,
    "reset_password_expiry" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livros" (
    "id" SERIAL NOT NULL,
    "identificador_externo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT,
    "descricao" TEXT,
    "capa" TEXT,
    "editora" TEXT,
    "data_publicacao" TEXT,
    "categoria" TEXT,
    "numero_paginas" INTEGER,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biblioteca" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "status_leitura" "StatusLeitura" NOT NULL DEFAULT 'QUERO_LER',
    "favorito" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biblioteca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "resenha" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunidade_posts" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "livro_id" INTEGER,
    "avaliacao_id" INTEGER,
    "conteudo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunidade_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunidade_curtida" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunidade_curtida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunidade_comentario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "conteudo" VARCHAR(1000) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunidade_comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamificacao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "conquistas_desbloqueadas" TEXT NOT NULL DEFAULT '[]',
    "historico" TEXT NOT NULL DEFAULT '[]',
    "total_livros" INTEGER NOT NULL DEFAULT 0,
    "total_lidos" INTEGER NOT NULL DEFAULT 0,
    "total_avaliacoes" INTEGER NOT NULL DEFAULT 0,
    "total_favoritos" INTEGER NOT NULL DEFAULT 0,
    "total_posts" INTEGER NOT NULL DEFAULT 0,
    "total_abandonados" INTEGER NOT NULL DEFAULT 0,
    "total_quero_ler" INTEGER NOT NULL DEFAULT 0,
    "total_lendo" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gamificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_key" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "livros_identificador_externo_key" ON "livros"("identificador_externo");

-- CreateIndex
CREATE UNIQUE INDEX "biblioteca_usuario_id_livro_id_key" ON "biblioteca"("usuario_id", "livro_id");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_usuario_id_livro_id_key" ON "avaliacoes"("usuario_id", "livro_id");

-- CreateIndex
CREATE UNIQUE INDEX "comunidade_posts_avaliacao_id_key" ON "comunidade_posts"("avaliacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "comunidade_curtida_usuario_id_post_id_key" ON "comunidade_curtida"("usuario_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "gamificacao_usuario_id_key" ON "gamificacao"("usuario_id");

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_posts" ADD CONSTRAINT "comunidade_posts_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_posts" ADD CONSTRAINT "comunidade_posts_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_posts" ADD CONSTRAINT "comunidade_posts_avaliacao_id_fkey" FOREIGN KEY ("avaliacao_id") REFERENCES "avaliacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_curtida" ADD CONSTRAINT "comunidade_curtida_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_curtida" ADD CONSTRAINT "comunidade_curtida_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "comunidade_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_comentario" ADD CONSTRAINT "comunidade_comentario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunidade_comentario" ADD CONSTRAINT "comunidade_comentario_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "comunidade_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamificacao" ADD CONSTRAINT "gamificacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
