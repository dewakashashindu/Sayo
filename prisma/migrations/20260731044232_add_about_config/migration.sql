-- CreateTable
CREATE TABLE `AboutConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `hero_eyebrow` VARCHAR(200) NOT NULL DEFAULT 'OUR STORY',
    `hero_heading` VARCHAR(500) NOT NULL DEFAULT 'We are experience in making you more beautiful',
    `hero_body` TEXT NOT NULL,
    `team_section_title` VARCHAR(200) NOT NULL DEFAULT 'Meet the Visionaries',
    `staff` JSON NOT NULL,
    `gallery_section_title` VARCHAR(200) NOT NULL DEFAULT 'Transformations & Artistry',
    `gallery_description` TEXT NOT NULL,
    `review_section_title` VARCHAR(200) NOT NULL DEFAULT 'What Our Clients Say',
    `reviews` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(100) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
