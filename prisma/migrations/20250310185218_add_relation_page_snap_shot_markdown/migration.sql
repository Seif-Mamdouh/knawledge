-- AddForeignKey
ALTER TABLE "PageSnapShots" ADD CONSTRAINT "PageSnapShots_markdown_id_fkey" FOREIGN KEY ("markdown_id") REFERENCES "Markdown"("markdown_id") ON DELETE RESTRICT ON UPDATE CASCADE;
