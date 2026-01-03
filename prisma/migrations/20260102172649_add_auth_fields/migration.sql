-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- Add status column
ALTER TABLE "users" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- Add refreshTokenHash column
ALTER TABLE "users" ADD COLUMN "refreshTokenHash" TEXT;
