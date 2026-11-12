-- AlterTable
ALTER TABLE "Day" ADD COLUMN     "supps_json" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "micro_targets_json" TEXT,
ADD COLUMN     "supplements_json" TEXT;

