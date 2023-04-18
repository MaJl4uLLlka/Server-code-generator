/*
  Warnings:

  - You are about to drop the column `templateId` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the `ControllerTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateRepositoryAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TemplateInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('None', 'OneToOne', 'OneToMany', 'ManyToMany');

-- DropForeignKey
ALTER TABLE "PrivateRepositoryAccess" DROP CONSTRAINT "PrivateRepositoryAccess_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "PrivateRepositoryAccess" DROP CONSTRAINT "PrivateRepositoryAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_templateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateInfo" DROP CONSTRAINT "TemplateInfo_controllerTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateInfo" DROP CONSTRAINT "TemplateInfo_entityTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateInfo" DROP CONSTRAINT "TemplateInfo_serviceTemplateId_fkey";

-- DropIndex
DROP INDEX "Repository_templateId_key";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "templateId",
DROP COLUMN "type";

-- DropTable
DROP TABLE "ControllerTemplate";

-- DropTable
DROP TABLE "EntityTemplate";

-- DropTable
DROP TABLE "PrivateRepositoryAccess";

-- DropTable
DROP TABLE "ServiceTemplate";

-- DropTable
DROP TABLE "TemplateInfo";

-- DropEnum
DROP TYPE "RepositoryType";

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "schema" JSONB NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "fromEntityId" TEXT NOT NULL,
    "sourceKey" TEXT,
    "toEntityId" TEXT NOT NULL,
    "foreignKey" TEXT,
    "linkType" "LinkType" NOT NULL DEFAULT 'None',

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Controller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Controller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "apiPrefix" TEXT,
    "port" INTEGER NOT NULL,
    "dbConnectionUri" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_entityId_key" ON "Service"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Controller_serviceId_key" ON "Controller"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_repositoryId_key" ON "Config"("repositoryId");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Controller" ADD CONSTRAINT "Controller_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Controller" ADD CONSTRAINT "Controller_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
