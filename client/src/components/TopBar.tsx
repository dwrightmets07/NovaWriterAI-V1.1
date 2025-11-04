import { Sparkles, Download, Upload, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { WordCounter } from "./WordCounter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { importFile, exportDocx, exportPdf } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

interface TopBarProps {
  documentTitle: string;
  autosaveStatus: "saved" | "saving" | "unsaved";
  onToggleAI: () => void;
  onToggleSidebar?: () => void;
  userEmail?: string;
  onLogout?: () => void;
  content: string;
  onContentImport?: (content: string) => void;
  onTitleChange?: (title: string) => void;
  isEditable?: boolean;
}

export function TopBar({
  documentTitle,
  autosaveStatus,
  onToggleAI,
  onToggleSidebar,
  userEmail = "user@example.com",
  onLogout,
  content,
  onContentImport,
  onTitleChange,
  isEditable = false,
}: TopBarProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const userInitials = userEmail
    .split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleExport = async (format: "docx" | "pdf") => {
    try {
      if (format === "docx") {
        await exportDocx(documentTitle, content);
        toast({
          title: "Export successful",
          description: "Document exported as DOCX",
        });
      } else {
        await exportPdf(documentTitle, content);
        toast({
          title: "Export successful",
          description: "Document exported as PDF",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export document",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedContent = await importFile(file);
      onContentImport?.(importedContent);
      toast({
        title: "Import successful",
        description: "File has been imported successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import file",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-30">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 overflow-hidden">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden flex-shrink-0"
            data-testid="button-toggle-sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link href="/dashboard">
          <h1 className="text-base sm:text-xl font-bold text-primary flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-logo">
            NovaWriter
          </h1>
        </Link>
        <div className="hidden sm:block text-muted-foreground flex-shrink-0">|</div>
        {isEditable ? (
          <input
            ref={titleInputRef}
            type="text"
            value={documentTitle}
            onChange={(e) => onTitleChange?.(e.target.value)}
            className="hidden sm:block text-sm text-foreground bg-transparent border-none outline-none focus:ring-0 truncate max-w-md"
            placeholder="Untitled Document"
            data-testid="input-document-title"
          />
        ) : (
          <span
            className="hidden sm:block text-sm text-muted-foreground truncate"
            data-testid="text-document-title"
          >
            {documentTitle}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <WordCounter content={content} />
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <AutosaveIndicator status={autosaveStatus} />

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAI}
          data-testid="button-toggle-ai"
        >
          <Sparkles className="h-5 w-5 text-chart-2" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="button-file-menu">
              <Download className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleImportClick}
              data-testid="button-import-file"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExport("docx")}
              data-testid="button-export-docx"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as DOCX
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("pdf")}
              data-testid="button-export-pdf"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full p-0"
              data-testid="button-user-menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {userEmail}
            </div>
            <DropdownMenuSeparator />
            {onLogout && (
              <DropdownMenuItem
                onClick={onLogout}
                data-testid="button-logout"
              >
                Log out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
