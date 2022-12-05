/*
  Warnings:

  - Added the required column `name` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "name" TEXT NOT NULL;
