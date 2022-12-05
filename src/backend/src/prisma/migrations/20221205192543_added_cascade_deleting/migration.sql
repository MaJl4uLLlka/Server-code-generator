-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_userId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateInfo" DROP CONSTRAINT "TemplateInfo_controllerTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateInfo" DROP CONSTRAINT "TemplateInfo_entityTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateInfo" DROP CONSTRAINT "TemplateInfo_serviceTemplateId_fkey";

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInfo" ADD CONSTRAINT "TemplateInfo_entityTemplateId_fkey" FOREIGN KEY ("entityTemplateId") REFERENCES "EntityTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInfo" ADD CONSTRAINT "TemplateInfo_serviceTemplateId_fkey" FOREIGN KEY ("serviceTemplateId") REFERENCES "ServiceTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateInfo" ADD CONSTRAINT "TemplateInfo_controllerTemplateId_fkey" FOREIGN KEY ("controllerTemplateId") REFERENCES "ControllerTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
