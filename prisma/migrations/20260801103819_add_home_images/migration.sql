/*
  Warnings:

  - You are about to alter the column `cusLocation` on the `tbl_feedback` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `homeconfig` ADD COLUMN `brand_story_image` VARCHAR(1000) NOT NULL DEFAULT '',
    ADD COLUMN `hero_bg_image` VARCHAR(1000) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `tbl_feedback` MODIFY `cusName` VARCHAR(200) NOT NULL,
    MODIFY `cusEmail` VARCHAR(200) NOT NULL,
    MODIFY `cusLocation` VARCHAR(100) NOT NULL,
    MODIFY `cusService` VARCHAR(200) NOT NULL,
    MODIFY `cusRating` INTEGER NOT NULL DEFAULT 0,
    MODIFY `cusComment` TEXT NOT NULL,
    MODIFY `cusConsent` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Tbl_Feedback_cusEmail_idx` ON `Tbl_Feedback`(`cusEmail`);

-- CreateIndex
CREATE INDEX `Tbl_Feedback_submittedAt_idx` ON `Tbl_Feedback`(`submittedAt`);

-- CreateIndex
CREATE INDEX `Tbl_Feedback_cusLocation_idx` ON `Tbl_Feedback`(`cusLocation`);

-- CreateIndex
CREATE INDEX `Tbl_Feedback_cusRating_idx` ON `Tbl_Feedback`(`cusRating`);

-- CreateIndex
CREATE INDEX `Tbl_Feedback_isPublished_idx` ON `Tbl_Feedback`(`isPublished`);
