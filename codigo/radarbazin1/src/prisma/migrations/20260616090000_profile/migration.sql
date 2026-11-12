-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT,
    "weight_kg" DOUBLE PRECISION,
    "skeletal_muscle_kg" DOUBLE PRECISION,
    "body_fat_pct" DOUBLE PRECISION,
    "tmb_kcal" INTEGER,
    "goal" TEXT,
    "ldl" INTEGER,
    "hdl" INTEGER,
    "triglycerides" INTEGER,
    "exam_date" TEXT,
    "notes" TEXT,
    "targets_json" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

