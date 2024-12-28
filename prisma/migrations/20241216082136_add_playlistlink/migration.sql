/*
  Warnings:

  - Added the required column `playlistLink` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "playlistLink" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
