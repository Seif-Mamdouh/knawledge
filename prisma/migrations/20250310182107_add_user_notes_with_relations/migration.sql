-- AlterTable
ALTER TABLE "MdSummary" ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "UserNotes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotes_userId_pageId_key" ON "UserNotes"("userId", "pageId");

-- AddForeignKey
ALTER TABLE "UserNotes" ADD CONSTRAINT "UserNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotes" ADD CONSTRAINT "UserNotes_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "MdSummary"("note_id") ON DELETE RESTRICT ON UPDATE CASCADE;
