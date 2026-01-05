-- CreateTable
CREATE TABLE "reputation_metrics" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "totalFeedbacks" INTEGER NOT NULL,
    "rating1" INTEGER NOT NULL DEFAULT 0,
    "rating2" INTEGER NOT NULL DEFAULT 0,
    "rating3" INTEGER NOT NULL DEFAULT 0,
    "rating4" INTEGER NOT NULL DEFAULT 0,
    "rating5" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reputation_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_history" (
    "id" TEXT NOT NULL,
    "reputationMetricsId" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "totalFeedbacks" INTEGER NOT NULL,
    "rating1" INTEGER NOT NULL DEFAULT 0,
    "rating2" INTEGER NOT NULL DEFAULT 0,
    "rating3" INTEGER NOT NULL DEFAULT 0,
    "rating4" INTEGER NOT NULL DEFAULT 0,
    "rating5" INTEGER NOT NULL DEFAULT 0,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reputation_metrics_companyId_key" ON "reputation_metrics"("companyId");

-- CreateIndex
CREATE INDEX "reputation_history_reputationMetricsId_idx" ON "reputation_history"("reputationMetricsId");

-- CreateIndex
CREATE INDEX "reputation_history_recordedAt_idx" ON "reputation_history"("recordedAt");

-- AddForeignKey
ALTER TABLE "reputation_metrics" ADD CONSTRAINT "reputation_metrics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_history" ADD CONSTRAINT "reputation_history_reputationMetricsId_fkey" FOREIGN KEY ("reputationMetricsId") REFERENCES "reputation_metrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
