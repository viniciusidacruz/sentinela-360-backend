-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CONSUMER', 'COMPANY_OWNER', 'COMPANY_ADMIN', 'SUPER_ADMIN');

-- CreateTable (creating as "users" to match schema mapping)
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "roles" "UserRole"[] DEFAULT ARRAY['CONSUMER']::"UserRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
