/*
  Warnings:

  - You are about to drop the column `createdBy` on the `pizza` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `pizza` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `pizza` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `pizza` table. All the data in the column will be lost.
  - You are about to drop the column `storedName` on the `pizza` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pizza` DROP COLUMN `createdBy`,
    DROP COLUMN `mimeType`,
    DROP COLUMN `path`,
    DROP COLUMN `size`,
    DROP COLUMN `storedName`,
    ADD COLUMN `publicUrl` VARCHAR(191) NULL;
