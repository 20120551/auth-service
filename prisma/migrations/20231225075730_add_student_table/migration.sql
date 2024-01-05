-- CreateEnum
CREATE TYPE "invitation_state" AS ENUM ('PROCESSING', 'SENT', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "user_course_role" AS ENUM ('HOST', 'TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "GradeReviewStatus" AS ENUM ('REQUEST', 'DONE');

-- CreateEnum
CREATE TYPE "grade_review_result_event" AS ENUM ('ASSIGN', 'REASSIGN', 'DONE');

-- CreateEnum
CREATE TYPE "grade_status" AS ENUM ('CREATED', 'DONE');

-- CreateEnum
CREATE TYPE "SupportedGradeType" AS ENUM ('SUB', 'PARENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "picture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "background" TEXT,
    "students" JSONB,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "state" "invitation_state" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "user_course_role" NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_card" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "card_expiration" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "student_card_image" TEXT NOT NULL,
    "univeristy_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "student_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_course" (
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "role" "user_course_role" NOT NULL,
    "invitation_id" TEXT,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_card_id" TEXT,

    CONSTRAINT "user_course_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateTable
CREATE TABLE "grade_structure" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "grade_status" NOT NULL,

    CONSTRAINT "grade_structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_type" (
    "id" TEXT NOT NULL,
    "grade_structure_id" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "type" "SupportedGradeType",
    "status" "grade_status" NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "grade_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_course_grade" (
    "id" TEXT NOT NULL,
    "grade_type_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "point" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_course_grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_review_result" (
    "id" TEXT NOT NULL,
    "point" DOUBLE PRECISION NOT NULL,
    "feedback" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "grade_review_id" TEXT NOT NULL,
    "event" "grade_review_result_event" NOT NULL,

    CONSTRAINT "grade_review_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_review" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expected_grade" DOUBLE PRECISION NOT NULL,
    "user_course_grade_id" TEXT NOT NULL,
    "status" "GradeReviewStatus" NOT NULL,

    CONSTRAINT "grade_review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_course_invitation_id_key" ON "user_course"("invitation_id");

-- CreateIndex
CREATE UNIQUE INDEX "grade_structure_course_id_key" ON "grade_structure"("course_id");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_card" ADD CONSTRAINT "student_card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_student_card_id_fkey" FOREIGN KEY ("student_card_id") REFERENCES "student_card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_structure" ADD CONSTRAINT "grade_structure_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_type" ADD CONSTRAINT "grade_type_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "grade_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_type" ADD CONSTRAINT "grade_type_grade_structure_id_fkey" FOREIGN KEY ("grade_structure_id") REFERENCES "grade_structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course_grade" ADD CONSTRAINT "user_course_grade_grade_type_id_fkey" FOREIGN KEY ("grade_type_id") REFERENCES "grade_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course_grade" ADD CONSTRAINT "user_course_grade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course_grade" ADD CONSTRAINT "user_course_grade_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_review_result" ADD CONSTRAINT "grade_review_result_grade_review_id_fkey" FOREIGN KEY ("grade_review_id") REFERENCES "grade_review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_review_result" ADD CONSTRAINT "grade_review_result_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_review" ADD CONSTRAINT "grade_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_review" ADD CONSTRAINT "grade_review_user_course_grade_id_fkey" FOREIGN KEY ("user_course_grade_id") REFERENCES "user_course_grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
