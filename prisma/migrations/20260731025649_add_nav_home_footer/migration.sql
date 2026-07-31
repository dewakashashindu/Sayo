-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `configKey` VARCHAR(50) NOT NULL,
    `configData` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SiteConfig_configKey_key`(`configKey`),
    INDEX `SiteConfig_configKey_idx`(`configKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminActivityLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminUsername` VARCHAR(100) NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `section` VARCHAR(50) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdminActivityLog_adminUsername_idx`(`adminUsername`),
    INDEX `AdminActivityLog_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NavConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `logo_text` VARCHAR(50) NOT NULL DEFAULT 'SAYO',
    `contact_btn_text` VARCHAR(100) NOT NULL DEFAULT 'CONTACT US',
    `contact_btn_link` VARCHAR(200) NOT NULL DEFAULT '/contact',
    `nav_items` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `hero_eyebrow` VARCHAR(200) NOT NULL DEFAULT 'Experienced hair stylists',
    `hero_heading` VARCHAR(500) NOT NULL DEFAULT 'Enjoy Professional Beauty Services!',
    `hero_body` TEXT NOT NULL,
    `hero_cta_text` VARCHAR(100) NOT NULL DEFAULT 'Reserve Experience',
    `hero_cta_link` VARCHAR(200) NOT NULL DEFAULT '/contact',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FooterConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `brand_name` VARCHAR(100) NOT NULL DEFAULT 'SAYO',
    `brand_tagline` VARCHAR(300) NOT NULL DEFAULT 'We are experienced in making you more beautiful',
    `contact_phone` VARCHAR(50) NOT NULL DEFAULT '+94 77 233 6233',
    `contact_email` VARCHAR(100) NOT NULL DEFAULT 'hello@sayobeauty.com',
    `contact_address` TEXT NOT NULL,
    `copyright_text` VARCHAR(300) NOT NULL DEFAULT '© 2025 SAYO Beauty. All rights reserved.',
    `locations` JSON NOT NULL,
    `quick_links` JSON NOT NULL,
    `social_whatsapp` VARCHAR(300) NOT NULL DEFAULT '',
    `social_facebook` VARCHAR(300) NOT NULL DEFAULT '',
    `social_instagram` VARCHAR(300) NOT NULL DEFAULT '',
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
