/*
  Warnings:

  - You are about to drop the column `originalName` on the `pizza` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `pizza` table. All the data in the column will be lost.
  - You are about to drop the column `publicUrl` on the `pizza` table. All the data in the column will be lost.
  - Added the required column `category` to the `Pizza` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `pizza` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pizza` DROP COLUMN `originalName`,
    DROP COLUMN `publicId`,
    DROP COLUMN `publicUrl`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    MODIFY `createdBy` VARCHAR(191) NOT NULL;
