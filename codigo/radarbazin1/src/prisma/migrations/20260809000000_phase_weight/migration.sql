-- AlterTable
ALTER TABLE "Day" ADD COLUMN     "weight_kg" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "phase" TEXT,
ADD COLUMN     "phase_set_at" TEXT;
