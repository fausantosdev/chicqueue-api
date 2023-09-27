/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Schedule_date_key" ON "Schedule"("date");
