-- CreateTable
CREATE TABLE "BpReading" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "sys" INTEGER NOT NULL,
    "dia" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BpReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BpReading_date_idx" ON "BpReading"("date");
