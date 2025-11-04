import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  id: string;
  title: string;
  preview: string;
  lastEdited: string;
  wordCount: number;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function DocumentCard({
  id,
  title,
  preview,
  lastEdited,
  wordCount,
  onClick,
  onRename,
  onDelete,
}: DocumentCardProps) {
  return (
    <Card
      className="p-4 hover-elevate cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-document-${id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <h3 className="font-semibold truncate" data-testid={`text-title-${id}`}>
            {title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              data-testid={`button-menu-${id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
              data-testid={`button-rename-${id}`}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
              data-testid={`button-delete-${id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
        {preview}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{lastEdited}</span>
        <Badge variant="secondary" className="text-xs">
          {wordCount} words
        </Badge>
      </div>
    </Card>
  );
}
