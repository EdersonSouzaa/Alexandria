-- AlterTable: password becomes optional (Google-only accounts have no local password)
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable: add optional Google account identifier
ALTER TABLE "users" ADD COLUMN "google_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");
