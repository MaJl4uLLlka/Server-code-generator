-- AlterTable
ALTER TABLE "ControllerTemplate" ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EntityTemplate" ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ServiceTemplate" ALTER COLUMN "value" DROP NOT NULL;
