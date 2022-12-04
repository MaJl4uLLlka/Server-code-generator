/*
  Warnings:

  - Added the required column `value` to the `ControllerTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `EntityTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `ServiceTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_stripeAccountId_key";

-- AlterTable
ALTER TABLE "ControllerTemplate" ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EntityTemplate" ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceTemplate" ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "stripeAccountId" DROP NOT NULL;
