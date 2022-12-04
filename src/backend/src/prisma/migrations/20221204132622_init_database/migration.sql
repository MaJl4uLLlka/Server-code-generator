-- CreateEnum
CREATE TYPE "RepositoryType" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "stripeAccountId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "type" "RepositoryType" NOT NULL DEFAULT 'PUBLIC',
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateInfo" (
    "id" TEXT NOT NULL,
    "entityTemplateId" TEXT NOT NULL,
    "serviceTemplateId" TEXT NOT NULL,
    "controllerTemplateId" TEXT NOT NULL,

    CONSTRAINT "TemplateInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityTemplate" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EntityTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTemplate" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ServiceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControllerTemplate" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ControllerTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeAccountId_key" ON "User"("stripeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_templateId_key" ON "Repository"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateInfo_entityTemplateId_key" ON "TemplateInfo"("entityTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateInfo_serviceTemplateId_key" ON "TemplateInfo"("serviceTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateInfo_controllerTemplateId_key" ON "TemplateInfo"("controllerTemplateId");

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInfo" ADD CONSTRAINT "TemplateInfo_entityTemplateId_fkey" FOREIGN KEY ("entityTemplateId") REFERENCES "EntityTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInfo" ADD CONSTRAINT "TemplateInfo_serviceTemplateId_fkey" FOREIGN KEY ("serviceTemplateId") REFERENCES "ServiceTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInfo" ADD CONSTRAINT "TemplateInfo_controllerTemplateId_fkey" FOREIGN KEY ("controllerTemplateId") REFERENCES "ControllerTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
