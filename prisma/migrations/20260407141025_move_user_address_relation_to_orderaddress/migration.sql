/*
  Warnings:

  - You are about to drop the column `orderAddressId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `OrderAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_orderAddressId_fkey`;

-- DropIndex
DROP INDEX `User_orderAddressId_key` ON `user`;

-- AlterTable
ALTER TABLE `orderaddress` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `orderAddressId`;

-- CreateIndex
CREATE UNIQUE INDEX `OrderAddress_userId_key` ON `OrderAddress`(`userId`);

-- AddForeignKey
ALTER TABLE `OrderAddress` ADD CONSTRAINT `OrderAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
