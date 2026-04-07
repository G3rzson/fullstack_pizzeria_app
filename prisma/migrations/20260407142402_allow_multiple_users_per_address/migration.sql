/*
  Warnings:

  - You are about to drop the column `userId` on the `orderaddress` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderaddress` DROP FOREIGN KEY `OrderAddress_userId_fkey`;

-- DropIndex
DROP INDEX `OrderAddress_userId_key` ON `orderaddress`;

-- AlterTable
ALTER TABLE `orderaddress` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `orderAddressId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_orderAddressId_fkey` FOREIGN KEY (`orderAddressId`) REFERENCES `OrderAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
