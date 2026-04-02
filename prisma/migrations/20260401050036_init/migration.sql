-- CreateTable
CREATE TABLE `Pasta` (
    `id` VARCHAR(191) NOT NULL,
    `pastaName` VARCHAR(191) NOT NULL,
    `pastaDescription` VARCHAR(191) NOT NULL,
    `pastaPrice` DOUBLE NOT NULL,
    `isAvailableOnMenu` BOOLEAN NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PastaImage` (
    `id` VARCHAR(191) NOT NULL,
    `pastaId` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `publicUrl` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PastaImage_pastaId_key`(`pastaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Drink` (
    `id` VARCHAR(191) NOT NULL,
    `drinkName` VARCHAR(191) NOT NULL,
    `drinkPrice` DOUBLE NOT NULL,
    `isAvailableOnMenu` BOOLEAN NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrinkImage` (
    `id` VARCHAR(191) NOT NULL,
    `drinkId` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `publicUrl` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DrinkImage_drinkId_key`(`drinkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PastaImage` ADD CONSTRAINT `PastaImage_pastaId_fkey` FOREIGN KEY (`pastaId`) REFERENCES `Pasta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrinkImage` ADD CONSTRAINT `DrinkImage_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
