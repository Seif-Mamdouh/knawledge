'use client';

import { ForwardedRef } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  UndoRedo,
  type MDXEditorMethods,
  type MDXEditorProps,
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  linkPlugin,
  linkDialogPlugin,
} from '@mdxeditor/editor';
import './MDXEditor.css';

const HEADING_OPTIONS = [
  {
    label: 'Paragraph',
    value: 'paragraph',
  },
  {
    label: 'Heading 1',
    value: 'h1',
  },
  {
    label: 'Heading 2',
    value: 'h2',
  },
  {
    label: 'Heading 3',
    value: 'h3',
  },
  {
    label: 'Heading 4',
    value: 'h4',
  },
];

export default function MDXEditorComponent({
  editorRef = null,
  className = '',
  ...props
}: { 
  editorRef?: ForwardedRef<MDXEditorMethods> | null,
  className?: string 
} & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin({
          allowedHeadingLevels: [1, 2, 3, 4, 5, 6]
        }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor]
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
            </>
          )
        })
      ]}
      {...props}
      ref={editorRef}
      contentEditableClassName="prose prose-invert max-w-none min-h-[200px] !text-gray-200"
      className={`mdx-editor ${className}`}
      markdown={props.markdown || ''}
    />
  );
}
