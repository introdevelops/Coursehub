/*
  Warnings:

  - A unique constraint covering the columns `[playlistLink]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_playlistLink_key" ON "Course"("playlistLink");
