-- CreateTable
CREATE TABLE `Pizza` (
    `id` VARCHAR(191) NOT NULL,
    `pizzaName` VARCHAR(191) NOT NULL,
    `pizzaDescription` VARCHAR(191) NOT NULL,
    `pizzaPrice32` DOUBLE NOT NULL,
    `pizzaPrice45` DOUBLE NOT NULL,
    `isAvailableOnMenu` BOOLEAN NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `storedName` VARCHAR(191) NULL,
    `mimeType` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `path` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
