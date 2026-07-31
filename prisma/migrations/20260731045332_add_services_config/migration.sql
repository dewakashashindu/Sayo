-- CreateTable
CREATE TABLE `ServicesConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `hero_heading` VARCHAR(500) NOT NULL DEFAULT 'Tailored Treatments for Your Unique Glow',
    `hero_subheading` TEXT,
    `toggle_description` TEXT NOT NULL DEFAULT 'Select a category below to explore our tailored treatments, pricing, and specialized artists.',
    `categories` JSON NOT NULL,
    `price_list` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
