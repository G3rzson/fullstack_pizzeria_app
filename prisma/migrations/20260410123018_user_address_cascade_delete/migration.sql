/*
  Warnings:

  - You are about to drop the column `orderAddressId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `OrderAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_orderAddressId_fkey`;

-- DropIndex
DROP INDEX `User_orderAddressId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `orderaddress` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `orderAddressId`,
    MODIFY `isStillWorkingHere` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `OrderAddress_userId_key` ON `OrderAddress`(`userId`);

-- AddForeignKey
ALTER TABLE `OrderAddress` ADD CONSTRAINT `OrderAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
