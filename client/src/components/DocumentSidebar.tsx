import { FileText, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  title: string;
}

interface DocumentSidebarProps {
  documents: Document[];
  activeDocumentId?: string;
  onSelectDocument: (id: string) => void;
  onAddDocument: () => void;
  onDeleteDocument?: (id: string) => void;
}

export function DocumentSidebar({
  documents,
  activeDocumentId,
  onSelectDocument,
  onAddDocument,
  onDeleteDocument,
}: DocumentSidebarProps) {
  return (
    <div className="h-full flex flex-col border-r bg-sidebar">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-sidebar-foreground">Documents</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddDocument}
          className="h-8 w-8"
          data-testid="button-add-document"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No documents yet
          </div>
        ) : (
          <div className="space-y-1">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-1 group">
                <Button
                  variant={activeDocumentId === doc.id ? "secondary" : "ghost"}
                  className="flex-1 justify-start gap-2 h-9 px-3"
                  onClick={() => onSelectDocument(doc.id)}
                  data-testid={`button-document-${doc.id}`}
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-sm">{doc.title}</span>
                </Button>
                {onDeleteDocument && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 flex-shrink-0"
                        data-testid={`button-document-menu-${doc.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDeleteDocument(doc.id)}
                        data-testid={`button-delete-document-${doc.id}`}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
