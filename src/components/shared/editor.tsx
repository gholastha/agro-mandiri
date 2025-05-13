'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Editor = ({ value, onChange, placeholder = 'Mulai menulis konten...' }: EditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const linkInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
    if (showImageInput && imageInputRef.current) {
      imageInputRef.current.focus();
    }
  }, [showLinkInput, showImageInput]);

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  const setHeading = (level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const startLinkInput = () => {
    setShowLinkInput(true);
    setShowImageInput(false);
  };

  const applyLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const startImageInput = () => {
    setShowImageInput(true);
    setShowLinkInput(false);
  };

  const insertImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    }
    setShowImageInput(false);
    setImageUrl('');
  };

  const alignLeft = () => {
    editor?.chain().focus().setTextAlign('left').run();
  };

  const alignCenter = () => {
    editor?.chain().focus().setTextAlign('center').run();
  };

  const alignRight = () => {
    editor?.chain().focus().setTextAlign('right').run();
  };

  const undo = () => {
    editor?.chain().focus().undo().run();
  };

  const redo = () => {
    editor?.chain().focus().redo().run();
  };

  const handleKeyDown = (e: React.KeyboardEvent, inputType: 'link' | 'image') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputType === 'link') {
        applyLink();
      } else {
        insertImage();
      }
    }
    if (e.key === 'Escape') {
      if (inputType === 'link') {
        setShowLinkInput(false);
        setLinkUrl('');
      } else {
        setShowImageInput(false);
        setImageUrl('');
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md bg-background">
      <div className="flex flex-wrap gap-1 p-2 border-b">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleBold}
          className={`px-2 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleItalic}
          className={`px-2 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setHeading(1)}
          className={`px-2 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setHeading(2)}
          className={`px-2 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setHeading(3)}
          className={`px-2 ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleBulletList}
          className={`px-2 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleOrderedList}
          className={`px-2 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={startLinkInput}
          className={`px-2 ${editor.isActive('link') ? 'bg-accent' : ''}`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={startImageInput}
          className="px-2"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button type="button" size="sm" variant="ghost" onClick={alignLeft} className="px-2">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={alignCenter} className="px-2">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={alignRight} className="px-2">
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button type="button" size="sm" variant="ghost" onClick={undo} className="px-2">
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={redo} className="px-2">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="p-2 flex items-center gap-2 border-b">
          <Input
            ref={linkInputRef}
            type="url"
            placeholder="Masukkan URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'link')}
          />
          <Button type="button" size="sm" onClick={applyLink}>
            Terapkan
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowLinkInput(false)}
          >
            Batal
          </Button>
        </div>
      )}

      {showImageInput && (
        <div className="p-2 flex items-center gap-2 border-b">
          <Input
            ref={imageInputRef}
            type="url"
            placeholder="Masukkan URL gambar"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'image')}
          />
          <Button type="button" size="sm" onClick={insertImage}>
            Sisipkan
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowImageInput(false)}
          >
            Batal
          </Button>
        </div>
      )}

      <div className="p-4 min-h-[200px] prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
