import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Chapter {
  id: string;
  title: string;
}

interface Project {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface ProjectSidebarProps {
  projects: Project[];
  activeChapterId?: string;
  onSelectChapter: (projectId: string, chapterId: string) => void;
  onAddChapter: (projectId: string) => void;
  onDeleteChapter?: (chapterId: string) => void;
  onAddProject?: () => void;
  sidebarTitle?: string;
}

export function ProjectSidebar({
  projects,
  activeChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onAddProject,
  sidebarTitle = "Projects",
}: ProjectSidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(projects.map((p) => p.id))
  );

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  return (
    <div className="h-full flex flex-col border-r bg-sidebar">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-sidebar-foreground">{sidebarTitle}</h2>
        {onAddProject && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddProject}
            className="h-8 w-8"
            data-testid="button-add-project"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {projects.map((project) => (
          <div key={project.id} className="mb-2">
            <div className="flex items-center gap-1 group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleProject(project.id)}
                className="h-8 w-8 flex-shrink-0"
                data-testid={`button-toggle-${project.id}`}
              >
                {expandedProjects.has(project.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                className="flex-1 justify-start gap-2 h-8 px-2"
                onClick={() => toggleProject(project.id)}
              >
                <Folder className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-sm">{project.title}</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 flex-shrink-0"
                    data-testid={`button-project-menu-${project.id}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onAddChapter(project.id)}
                    data-testid={`button-add-chapter-${project.id}`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Chapter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {expandedProjects.has(project.id) && (
              <div className="ml-8 mt-1 space-y-1">
                {project.chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center gap-1 group">
                    <Button
                      variant={
                        activeChapterId === chapter.id ? "secondary" : "ghost"
                      }
                      className="flex-1 justify-start gap-2 h-8 px-2 text-sm"
                      onClick={() => onSelectChapter(project.id, chapter.id)}
                      data-testid={`button-chapter-${chapter.id}`}
                    >
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{chapter.title}</span>
                    </Button>
                    {onDeleteChapter && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 flex-shrink-0"
                            data-testid={`button-chapter-menu-${chapter.id}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onDeleteChapter(chapter.id)}
                            className="text-destructive"
                            data-testid={`button-delete-chapter-${chapter.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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
        ))}
      </div>
    </div>
  );
}
