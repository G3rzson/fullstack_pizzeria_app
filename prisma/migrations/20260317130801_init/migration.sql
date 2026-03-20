-- CreateTable
CREATE TABLE `PizzaImage` (
    `id` VARCHAR(191) NOT NULL,
    `pizzaId` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `publicUrl` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PizzaImage_pizzaId_key`(`pizzaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PizzaImage` ADD CONSTRAINT `PizzaImage_pizzaId_fkey` FOREIGN KEY (`pizzaId`) REFERENCES `Pizza`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
