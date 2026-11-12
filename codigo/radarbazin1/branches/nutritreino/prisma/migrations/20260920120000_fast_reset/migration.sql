-- Reinício manual do jejum ("comi agora"). ISO timestamp opcional.
ALTER TABLE "Profile" ADD COLUMN "fast_reset_at" TEXT;
