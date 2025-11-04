import { type Editor } from "@tiptap/react";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Minus,
  Type,
  Highlighter,
  Palette,
  Eraser,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface EditorToolbarProps {
  editor: Editor | null;
  onInsertPageBreak?: () => void;
}

export function EditorToolbar({ editor, onInsertPageBreak }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    label,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    label: string;
    title?: string;
  }) => (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      onClick={onClick}
      className="h-8 w-8"
      title={title || label}
      data-testid={`button-${label.toLowerCase()}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    }
  };

  const textColors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000"
  ];

  const highlightColors = [
    "#FFFF00", "#90EE90", "#FFB6C1", "#ADD8E6", "#FFDAB9",
    "#E6E6FA", "#F0E68C", "#DDA0DD", "#B0E0E6", "#FAFAD2"
  ];

  return (
    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm p-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            label="Bold"
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            label="Italic"
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            label="Underline"
            title="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            label="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={Code}
            label="Code"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <Select
            value={
              editor.isActive("heading", { level: 1 }) ? "h1" :
              editor.isActive("heading", { level: 2 }) ? "h2" :
              editor.isActive("heading", { level: 3 }) ? "h3" :
              "paragraph"
            }
            onValueChange={(value) => {
              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else if (value === "h1") {
                editor.chain().focus().setHeading({ level: 1 }).run();
              } else if (value === "h2") {
                editor.chain().focus().setHeading({ level: 2 }).run();
              } else if (value === "h3") {
                editor.chain().focus().setHeading({ level: 3 }).run();
              }
            }}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Family */}
        <div className="flex items-center gap-0.5">
          <Select
            value={editor.getAttributes("textStyle").fontFamily || "serif"}
            onValueChange={(value) => {
              if (value === "default") {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(value).run();
              }
            }}
          >
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="sans-serif">Sans Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-0.5">
          <Select
            value={editor.getAttributes("textStyle").fontSize || "16px"}
            onValueChange={(value) => {
              if (value === "default") {
                const attrs = editor.getAttributes("textStyle");
                const { fontSize, ...rest } = attrs;
                if (Object.keys(rest).length > 0) {
                  editor.chain().focus().setMark("textStyle", rest).run();
                } else {
                  editor.chain().focus().unsetMark("textStyle").run();
                }
              } else {
                editor.chain().focus().setMark("textStyle", { fontSize: value }).run();
              }
            }}
          >
            <SelectTrigger className="w-[90px] h-8" data-testid="select-font-size">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
              <SelectItem value="48px">48px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Text Color">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-1">
              {textColors.map((color) => (
                <button
                  key={color}
                  className="h-6 w-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Clear Color
            </Button>
          </PopoverContent>
        </Popover>

        {/* Highlight Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Highlight">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-1">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  className="h-6 w-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Clear Highlight
            </Button>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            label="BulletList"
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            label="OrderedList"
            title="Numbered List"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            label="AlignLeft"
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            label="AlignCenter"
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            label="AlignRight"
            title="Align Right"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Link */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive("link") ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setLink();
                  }
                }}
              />
              <Button onClick={setLink} size="sm">
                Add
              </Button>
            </div>
            {editor.isActive("link") && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full"
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                Remove Link
              </Button>
            )}
          </PopoverContent>
        </Popover>

        {/* Quote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          label="Quote"
          title="Block Quote"
        />

        {/* Horizontal Rule */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          label="HorizontalRule"
          title="Horizontal Line"
        />

        {/* Page Break */}
        {onInsertPageBreak && (
          <ToolbarButton
            onClick={onInsertPageBreak}
            icon={FileText}
            label="PageBreak"
            title="Insert Page Break"
          />
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          icon={Eraser}
          label="ClearFormat"
          title="Clear Formatting"
        />

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            label="Undo"
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            label="Redo"
            title="Redo (Ctrl+Shift+Z)"
          />
        </div>
      </div>
    </div>
  );
}
