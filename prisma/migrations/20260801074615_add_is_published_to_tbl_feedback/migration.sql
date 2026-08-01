/*
  Warnings:

  - You are about to alter the column `cusName` on the `tbl_feedback` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - You are about to alter the column `cusEmail` on the `tbl_feedback` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - You are about to alter the column `cusService` on the `tbl_feedback` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.

*/
-- DropIndex
DROP INDEX `Tbl_Feedback_cusEmail_idx` ON `tbl_feedback`;

-- DropIndex
DROP INDEX `Tbl_Feedback_cusLocation_idx` ON `tbl_feedback`;

-- DropIndex
DROP INDEX `Tbl_Feedback_cusRating_idx` ON `tbl_feedback`;

-- DropIndex
DROP INDEX `Tbl_Feedback_isPublished_idx` ON `tbl_feedback`;

-- DropIndex
DROP INDEX `Tbl_Feedback_submittedAt_idx` ON `tbl_feedback`;

-- AlterTable
ALTER TABLE `tbl_feedback` MODIFY `cusName` VARCHAR(191) NOT NULL,
    MODIFY `cusEmail` VARCHAR(191) NOT NULL,
    MODIFY `cusLocation` VARCHAR(191) NOT NULL,
    MODIFY `cusService` VARCHAR(191) NOT NULL,
    ALTER COLUMN `cusRating` DROP DEFAULT,
    MODIFY `cusComment` VARCHAR(191) NOT NULL,
    ALTER COLUMN `cusConsent` DROP DEFAULT;
