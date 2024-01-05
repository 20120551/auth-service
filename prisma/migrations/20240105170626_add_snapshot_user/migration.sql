/*
  Warnings:

  - You are about to drop the column `student_card_id` on the `user_course` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `user_course_grade` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_course_grade` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `student_card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[grade_type_id,student_id]` on the table `user_course_grade` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `student_id` to the `user_course_grade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_course" DROP CONSTRAINT "user_course_student_card_id_fkey";

-- DropForeignKey
ALTER TABLE "user_course_grade" DROP CONSTRAINT "user_course_grade_course_id_fkey";

-- DropForeignKey
ALTER TABLE "user_course_grade" DROP CONSTRAINT "user_course_grade_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_course" DROP COLUMN "student_card_id";

-- AlterTable
ALTER TABLE "user_course_grade" DROP COLUMN "course_id",
DROP COLUMN "user_id",
ADD COLUMN     "student_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_card_user_id_key" ON "student_card"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_course_grade_grade_type_id_student_id_key" ON "user_course_grade"("grade_type_id", "student_id");
