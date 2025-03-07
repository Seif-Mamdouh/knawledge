/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Markdown` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MdSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PageSnapShots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `QuoteEmbedding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TitleEmbedding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_note_id_fkey";

-- DropForeignKey
ALTER TABLE "MdSummary" DROP CONSTRAINT "MdSummary_note_id_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_userId_fkey";

-- DropForeignKey
ALTER TABLE "PageSnapShots" DROP CONSTRAINT "PageSnapShots_page_id_fkey";

-- DropForeignKey
ALTER TABLE "QuoteEmbedding" DROP CONSTRAINT "QuoteEmbedding_note_id_fkey";

-- DropForeignKey
ALTER TABLE "TitleEmbedding" DROP CONSTRAINT "TitleEmbedding_note_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "note_id" DROP DEFAULT,
ALTER COLUMN "note_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("note_id");
DROP SEQUENCE "Category_note_id_seq";

-- AlterTable
ALTER TABLE "Markdown" DROP CONSTRAINT "Markdown_pkey",
ALTER COLUMN "markdown_id" DROP DEFAULT,
ALTER COLUMN "markdown_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Markdown_pkey" PRIMARY KEY ("markdown_id");
DROP SEQUENCE "Markdown_markdown_id_seq";

-- AlterTable
ALTER TABLE "MdSummary" DROP CONSTRAINT "MdSummary_pkey",
ALTER COLUMN "note_id" DROP DEFAULT,
ALTER COLUMN "note_id" SET DATA TYPE TEXT,
ALTER COLUMN "note_summary_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MdSummary_pkey" PRIMARY KEY ("note_id");
DROP SEQUENCE "MdSummary_note_id_seq";

-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Page_id_seq";

-- AlterTable
ALTER TABLE "PageSnapShots" DROP CONSTRAINT "PageSnapShots_pkey",
ALTER COLUMN "page_snapshot_id" DROP DEFAULT,
ALTER COLUMN "page_snapshot_id" SET DATA TYPE TEXT,
ALTER COLUMN "page_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PageSnapShots_pkey" PRIMARY KEY ("page_snapshot_id");
DROP SEQUENCE "PageSnapShots_page_snapshot_id_seq";

-- AlterTable
ALTER TABLE "QuoteEmbedding" DROP CONSTRAINT "QuoteEmbedding_pkey",
ALTER COLUMN "note_id" DROP DEFAULT,
ALTER COLUMN "note_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "QuoteEmbedding_pkey" PRIMARY KEY ("note_id");
DROP SEQUENCE "QuoteEmbedding_note_id_seq";

-- AlterTable
ALTER TABLE "TitleEmbedding" DROP CONSTRAINT "TitleEmbedding_pkey",
ALTER COLUMN "note_id" DROP DEFAULT,
ALTER COLUMN "note_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TitleEmbedding_pkey" PRIMARY KEY ("note_id");
DROP SEQUENCE "TitleEmbedding_note_id_seq";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Users_id_seq";

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
