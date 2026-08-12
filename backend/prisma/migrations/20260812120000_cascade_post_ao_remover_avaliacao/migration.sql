-- Apagar uma avaliação passava a chave `avaliacao_id` do post para NULL (ON DELETE SET NULL),
-- deixando a publicação órfã no feed da comunidade. Agora o post sai junto com a avaliação.
--
-- Esta migração altera apenas a constraint: as publicações já órfãs criadas pelo
-- comportamento antigo (`avaliacao_id IS NULL`) são preservadas de propósito e
-- continuam visíveis no feed. Para removê-las, rode manualmente:
--   DELETE FROM "comunidade_posts" WHERE "avaliacao_id" IS NULL;

-- DropForeignKey
ALTER TABLE "comunidade_posts" DROP CONSTRAINT "comunidade_posts_avaliacao_id_fkey";

-- AddForeignKey
ALTER TABLE "comunidade_posts" ADD CONSTRAINT "comunidade_posts_avaliacao_id_fkey" FOREIGN KEY ("avaliacao_id") REFERENCES "avaliacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
