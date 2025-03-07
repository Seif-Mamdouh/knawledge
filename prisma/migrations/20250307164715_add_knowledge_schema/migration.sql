/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSnapShots" (
    "page_snapshot_id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "raw_html" TEXT NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cleaned_html" TEXT,
    "cleaned_at" TIMESTAMP(3),
    "markdown_id" TEXT NOT NULL,

    CONSTRAINT "PageSnapShots_pkey" PRIMARY KEY ("page_snapshot_id")
);

-- CreateTable
CREATE TABLE "Markdown" (
    "markdown_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content_md" TEXT NOT NULL,

    CONSTRAINT "Markdown_pkey" PRIMARY KEY ("markdown_id")
);

-- CreateTable
CREATE TABLE "MdSummary" (
    "note_id" SERIAL NOT NULL,
    "note_summary_id" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "engine_version" TEXT NOT NULL,

    CONSTRAINT "MdSummary_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "TitleEmbedding" (
    "note_id" SERIAL NOT NULL,
    "embedding" BYTEA NOT NULL,

    CONSTRAINT "TitleEmbedding_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "QuoteEmbedding" (
    "note_id" SERIAL NOT NULL,
    "markdown_start" INTEGER NOT NULL,
    "markdown_end" INTEGER NOT NULL,
    "embedding" BYTEA NOT NULL,

    CONSTRAINT "QuoteEmbedding_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "note_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("note_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PageSnapShots_markdown_id_key" ON "PageSnapShots"("markdown_id");

-- CreateIndex
CREATE UNIQUE INDEX "MdSummary_note_summary_id_engine_version_key" ON "MdSummary"("note_summary_id", "engine_version");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSnapShots" ADD CONSTRAINT "PageSnapShots_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MdSummary" ADD CONSTRAINT "MdSummary_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Markdown"("markdown_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleEmbedding" ADD CONSTRAINT "TitleEmbedding_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Markdown"("markdown_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteEmbedding" ADD CONSTRAINT "QuoteEmbedding_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Markdown"("markdown_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Markdown"("markdown_id") ON DELETE RESTRICT ON UPDATE CASCADE;
