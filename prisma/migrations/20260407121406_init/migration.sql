/*
  Warnings:

  - A unique constraint covering the columns `[orderAddressId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `orderAddressId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OrderAddress` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `houseNumber` VARCHAR(191) NOT NULL,
    `floorAndDoor` VARCHAR(191) NOT NULL,
    `isSaved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_orderAddressId_key` ON `User`(`orderAddressId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_orderAddressId_fkey` FOREIGN KEY (`orderAddressId`) REFERENCES `OrderAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
