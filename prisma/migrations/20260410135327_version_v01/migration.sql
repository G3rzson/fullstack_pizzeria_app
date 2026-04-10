-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `isStillWorkingHere` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderAddress` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `houseNumber` VARCHAR(191) NOT NULL,
    `floorAndDoor` VARCHAR(191) NULL,
    `isSaved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OrderAddress_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pizza` (
    `id` VARCHAR(191) NOT NULL,
    `pizzaName` VARCHAR(191) NOT NULL,
    `pizzaDescription` VARCHAR(191) NOT NULL,
    `pizzaPrice32` DOUBLE NOT NULL,
    `pizzaPrice45` DOUBLE NOT NULL,
    `isAvailableOnMenu` BOOLEAN NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `OrderAddress` ADD CONSTRAINT `OrderAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_pizzaId_fkey` FOREIGN KEY (`pizzaId`) REFERENCES `Pizza`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_pastaId_fkey` FOREIGN KEY (`pastaId`) REFERENCES `Pasta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
