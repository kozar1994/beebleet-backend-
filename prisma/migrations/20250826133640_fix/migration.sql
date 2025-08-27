-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."SubscriptionStatus" ADD VALUE 'PENDING';
ALTER TYPE "public"."SubscriptionStatus" ADD VALUE 'AWAITING_PAYMENT';

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "public"."Invoice" ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
