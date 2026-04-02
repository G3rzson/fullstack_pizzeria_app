/*
  Warnings:

  - You are about to drop the `drinkimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pastaimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pizzaimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `drinkimage` DROP FOREIGN KEY `DrinkImage_drinkId_fkey`;

-- DropForeignKey
ALTER TABLE `pastaimage` DROP FOREIGN KEY `PastaImage_pastaId_fkey`;

-- DropForeignKey
ALTER TABLE `pizzaimage` DROP FOREIGN KEY `PizzaImage_pizzaId_fkey`;

-- DropTable
DROP TABLE `drinkimage`;

-- DropTable
DROP TABLE `pastaimage`;

-- DropTable
DROP TABLE `pizzaimage`;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `publicUrl` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `pizzaId` VARCHAR(191) NULL,
    `pastaId` VARCHAR(191) NULL,
    `drinkId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Image_pizzaId_key`(`pizzaId`),
    UNIQUE INDEX `Image_pastaId_key`(`pastaId`),
    UNIQUE INDEX `Image_drinkId_key`(`drinkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_pizzaId_fkey` FOREIGN KEY (`pizzaId`) REFERENCES `Pizza`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_pastaId_fkey` FOREIGN KEY (`pastaId`) REFERENCES `Pasta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
