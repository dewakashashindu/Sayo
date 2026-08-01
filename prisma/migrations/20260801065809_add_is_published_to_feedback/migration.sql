-- CreateTable
CREATE TABLE `ServicesConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `hero_heading` VARCHAR(500) NOT NULL DEFAULT 'Tailored Treatments for Your Unique Glow',
    `hero_subtitle` TEXT NOT NULL,
    `categories` JSON NOT NULL,
    `price_list` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `hero_eyebrow` VARCHAR(200) NOT NULL DEFAULT 'Luxury Concierge Experience',
    `hero_heading` VARCHAR(200) NOT NULL DEFAULT 'GET IN TOUCH',
    `hero_subtitle` TEXT NOT NULL,
    `cta_primary_text` VARCHAR(100) NOT NULL DEFAULT 'Send an Inquiry',
    `cta_secondary_text` VARCHAR(100) NOT NULL DEFAULT 'Call Us Now',
    `phone_number` VARCHAR(50) NOT NULL DEFAULT '0772336233',
    `email_address` VARCHAR(100) NOT NULL DEFAULT 'info@sayobeauty.com',
    `stats` JSON NOT NULL,
    `map_embed_src` TEXT NOT NULL,
    `map_address` TEXT NOT NULL,
    `map_open_href` TEXT NOT NULL,
    `social_instagram` VARCHAR(300) NOT NULL DEFAULT '',
    `social_facebook` VARCHAR(300) NOT NULL DEFAULT '',
    `social_whatsapp` VARCHAR(300) NOT NULL DEFAULT '',
    `branches` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tbl_Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cusName` VARCHAR(200) NOT NULL,
    `cusEmail` VARCHAR(200) NOT NULL,
    `cusLocation` VARCHAR(100) NOT NULL,
    `cusService` VARCHAR(200) NOT NULL,
    `cusRating` INTEGER NOT NULL DEFAULT 0,
    `cusComment` TEXT NOT NULL,
    `cusConsent` BOOLEAN NOT NULL DEFAULT false,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Tbl_Feedback_cusEmail_idx`(`cusEmail`),
    INDEX `Tbl_Feedback_submittedAt_idx`(`submittedAt`),
    INDEX `Tbl_Feedback_cusLocation_idx`(`cusLocation`),
    INDEX `Tbl_Feedback_cusRating_idx`(`cusRating`),
    INDEX `Tbl_Feedback_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
