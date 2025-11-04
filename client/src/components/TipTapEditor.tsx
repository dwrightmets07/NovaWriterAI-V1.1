import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { Node, Extension } from "@tiptap/core";
import { EditorToolbar } from "./EditorToolbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Type, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, X } from "lucide-react";

// FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

const PageBreak = Node.create({
  name: "pageBreak",
  group: "block",
  parseHTML() {
    return [{ tag: 'div[data-type="page-break"]' }];
  },
  renderHTML() {
    return [
      "div",
      {
        "data-type": "page-break",
        class: "page-break",
      },
      [
        "div",
        {
          class: "page-break-line",
        },
      ],
      [
        "div",
        {
          class: "page-break-label",
        },
        "Page Break",
      ],
    ];
  },
  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    } as any;
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: TipTapEditorProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isLocalUpdate = useRef(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      console.log('[TipTapEditor] Mobile detection - width:', window.innerWidth, 'userAgent:', navigator.userAgent, 'isMobile:', mobile);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      PageBreak,
    ],
    content,
    editable: true,
    onUpdate: ({ editor }) => {
      isLocalUpdate.current = true;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 pt-12 pb-6 font-serif",
      },
    },
  });

  useEffect(() => {
    // Don't update if this content came from the editor itself
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false;
      return;
    }
    
    // Only update editor if content is genuinely different from external source
    if (editor && content !== editor.getHTML()) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(content, { emitUpdate: false });
      // Restore cursor position if there's content
      if (from <= editor.state.doc.content.size) {
        editor.commands.setTextSelection({ 
          from: Math.min(from, editor.state.doc.content.size), 
          to: Math.min(to, editor.state.doc.content.size) 
        });
      }
    }
  }, [editor, content]);

  const pageBreakCount = (content.match(/data-type="page-break"/g) || []).length;
  const totalPages = pageBreakCount + 1;

  const scrollToPage = (pageNum: number) => {
    if (!editor) return;
    const editorElement = document.querySelector('[data-testid="editor-content"]');
    if (!editorElement) return;
    
    const pageBreaks = editorElement.querySelectorAll('[data-type="page-break"]');
    if (pageNum === 1) {
      editorElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (pageNum <= totalPages && pageBreaks[pageNum - 2]) {
      pageBreaks[pageNum - 2].scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setCurrentPage(pageNum);
  };

  const toggleMobileToolbar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileToolbar(!showMobileToolbar);
  };

  useEffect(() => {
    if (!editor) return;
    
    const handleFocus = () => {
      console.log('[TipTapEditor] Editor focused, showing floating toolbar');
      setShowFloatingToolbar(true);
    };
    const handleBlur = () => {
      console.log('[TipTapEditor] Editor blurred, hiding toolbar');
      setTimeout(() => {
        setShowFloatingToolbar(false);
        setShowMobileToolbar(false);
      }, 200);
    };
    
    editor.on('focus', handleFocus);
    editor.on('blur', handleBlur);
    
    return () => {
      editor.off('focus', handleFocus);
      editor.off('blur', handleBlur);
    };
  }, [editor]);

  console.log('[TipTapEditor] Render - showFloatingToolbar:', showFloatingToolbar, 'showMobileToolbar:', showMobileToolbar);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} onInsertPageBreak={() => (editor as any)?.commands?.setPageBreak?.()} />
      <div ref={editorContainerRef} className="flex-1 overflow-y-auto bg-background relative">
        <div className="mx-auto max-w-4xl">
          <EditorContent editor={editor} data-testid="editor-content" />
        </div>
        
        {isMobile && (
          <Button
            size="icon"
            variant="default"
            className="fixed top-20 right-4 h-12 w-12 rounded-full shadow-lg z-50"
            onPointerDown={(e) => {
              console.log('[TOOLBAR FIX ACTIVE] Floating button tapped, isMobile:', isMobile);
              toggleMobileToolbar(e);
            }}
            data-testid="button-open-mobile-toolbar"
          >
            <Type className="h-5 w-5" />
          </Button>
        )}
        
        {showMobileToolbar && editor && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-sm font-medium">Format</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onPointerDown={toggleMobileToolbar}
                data-testid="button-close-mobile-toolbar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-1 p-2">
              <Button
                size="sm"
                variant={editor.isActive("bold") ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleBold().run();
                }}
                data-testid="mobile-button-bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("italic") ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleItalic().run();
                }}
                data-testid="mobile-button-italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("underline") ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleUnderline().run();
                }}
                data-testid="mobile-button-underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                }}
                data-testid="mobile-button-h1"
              >
                H1
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                }}
                data-testid="mobile-button-h2"
              >
                H2
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("bulletList") ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleBulletList().run();
                }}
                data-testid="mobile-button-bullet-list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("orderedList") ? "default" : "outline"}
                className="h-9"
                onPointerDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleOrderedList().run();
                }}
                data-testid="mobile-button-ordered-list"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="border-t bg-background/95 px-4 py-2 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="text-page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            data-testid="button-next-page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
