import { useState, useRef } from "react";
import { Plus, FolderPlus, Upload, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "./DocumentCard";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Footer } from "@/components/Footer";

interface Document {
  id: string;
  title: string;
  preview: string;
  lastEdited: string;
  wordCount: number;
}

interface Project {
  id: string;
  title: string;
  documentCount: number;
  lastEdited: string;
}

interface DashboardProps {
  documents: Document[];
  projects: Project[];
  userEmail: string;
  userRole?: string;
  onCreateDocument: () => void;
  onCreateProject: () => void;
  onOpenDocument: (id: string) => void;
  onOpenProject: (id: string) => void;
  onRenameDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onRenameProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onLogout: () => void;
  onImportFile?: (file: File) => void;
}

export function Dashboard({
  documents,
  projects,
  userEmail,
  userRole,
  onCreateDocument,
  onCreateProject,
  onOpenDocument,
  onOpenProject,
  onRenameDocument,
  onDeleteDocument,
  onRenameProject,
  onDeleteProject,
  onLogout,
  onImportFile,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitials = userEmail
    .split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportFile) {
      onImportFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf,.txt"
        onChange={handleFileChange}
        className="hidden"
        data-testid="input-file-upload"
      />
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/dashboard">
            <div className="cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-logo-dashboard">
              <h1 className="text-xl font-bold text-primary">NovaWriter</h1>
              <p className="text-xs text-muted-foreground">For Writers, By Writers.</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
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
                <DropdownMenuItem asChild>
                  <Link href="/account" data-testid="link-account">
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/writing-style" data-testid="link-writing-style">
                    Writing Style
                  </Link>
                </DropdownMenuItem>
                {userRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" data-testid="link-admin">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/contact" data-testid="link-contact">
                    Contact Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" data-testid="link-about">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  data-testid="button-logout"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Workspace</h2>
          <p className="text-muted-foreground">
            Manage your documents and projects
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="projects" data-testid="tab-projects">
                Projects
              </TabsTrigger>
              <TabsTrigger value="documents" data-testid="tab-documents">
                Documents
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 flex-wrap">
              {/* DASHBOARD FIX ACTIVE: Using flex-wrap to prevent button cutoff */}
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="whitespace-nowrap"
                data-testid="button-import-document"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import File
              </Button>
              <Button
                onClick={onCreateDocument}
                className="whitespace-nowrap"
                data-testid="button-create-document"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
              <Button
                onClick={onCreateProject}
                variant="outline"
                className="whitespace-nowrap"
                data-testid="button-create-project"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          <TabsContent value="projects" className="mt-0">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No projects yet. Create a project to organize your chapters!
                </p>
                <Button onClick={onCreateProject}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="p-4 hover-elevate cursor-pointer transition-all"
                    onClick={() => onOpenProject(project.id)}
                    data-testid={`card-project-${project.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FolderPlus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-semibold truncate" data-testid={`text-title-${project.id}`}>
                          {project.title}
                        </h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            data-testid={`button-menu-${project.id}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onRenameProject(project.id);
                            }}
                            data-testid={`button-rename-${project.id}`}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(project.id);
                            }}
                            className="text-destructive"
                            data-testid={`button-delete-${project.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.documentCount} chapters • Last edited {project.lastEdited}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No documents yet. Create your first document to get started!
                </p>
                <Button onClick={onCreateDocument}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    {...doc}
                    onClick={() => onOpenDocument(doc.id)}
                    onRename={() => onRenameDocument(doc.id)}
                    onDelete={() => onDeleteDocument(doc.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
