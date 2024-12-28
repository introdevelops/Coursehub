-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_courseId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
