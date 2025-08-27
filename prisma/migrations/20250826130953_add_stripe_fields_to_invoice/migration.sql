/*
  Warnings:

  - The primary key for the `Plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."PlanChange" DROP CONSTRAINT "PlanChange_fromPlanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlanChange" DROP CONSTRAINT "PlanChange_toPlanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "stripePaymentId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;

-- AlterTable
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Plan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Plan_id_seq";

-- AlterTable
ALTER TABLE "public"."PlanChange" ALTER COLUMN "fromPlanId" SET DATA TYPE TEXT,
ALTER COLUMN "toPlanId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Subscription" ALTER COLUMN "planId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeSessionId_key" ON "public"."Invoice"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Invoice_stripeSessionId_idx" ON "public"."Invoice"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanChange" ADD CONSTRAINT "PlanChange_fromPlanId_fkey" FOREIGN KEY ("fromPlanId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanChange" ADD CONSTRAINT "PlanChange_toPlanId_fkey" FOREIGN KEY ("toPlanId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
