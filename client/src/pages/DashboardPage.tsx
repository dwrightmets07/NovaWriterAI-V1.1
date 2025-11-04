import { Dashboard } from "@/components/Dashboard";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useDocuments, useProjects, useCreateDocument, useCreateProject, useDeleteDocument, useDeleteProject, importFile } from "@/lib/api";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading: documentsLoading } = useDocuments();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const createDocumentMutation = useCreateDocument();
  const createProjectMutation = useCreateProject();
  const deleteDocumentMutation = useDeleteDocument();
  const deleteProjectMutation = useDeleteProject();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation]);

  const handleCreateDocument = async () => {
    try {
      const doc = await createDocumentMutation.mutateAsync({
        title: "Untitled Document",
        content: "<p>Start writing...</p>",
      });
      setLocation(`/editor/${doc.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create document",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleCreateProject = async () => {
    try {
      await createProjectMutation.mutateAsync({
        title: "New Project",
      });
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleOpenDocument = (id: string) => {
    setLocation(`/editor/${id}`);
  };

  const handleOpenProject = (id: string) => {
    setLocation(`/project/${id}`);
  };

  const handleRenameDocument = async (id: string) => {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
      try {
        await apiRequest("PATCH", `/api/documents/${id}`, { title: newTitle });
        queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
        toast({
          title: "Document renamed",
          description: "Document has been renamed successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to rename document",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocumentMutation.mutateAsync(id);
        toast({
          title: "Document deleted",
          description: "Document has been deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete document",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const importedContent = await importFile(file);
      const doc = await createDocumentMutation.mutateAsync({
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: importedContent,
      });
      toast({
        title: "File imported",
        description: "Your file has been imported successfully",
      });
      setLocation(`/editor/${doc.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import file",
      });
    }
  };

  const handleRenameProject = async (id: string) => {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
      try {
        await apiRequest("PATCH", `/api/projects/${id}`, { title: newTitle });
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        toast({
          title: "Project renamed",
          description: "Project has been renamed successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to rename project",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? All chapters will be deleted.")) {
      try {
        await deleteProjectMutation.mutateAsync(id);
        toast({
          title: "Project deleted",
          description: "Project and all chapters have been deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete project",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  if (authLoading || documentsLoading || projectsLoading) {
    return null;
  }

  const formattedDocuments = (documents || []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    preview: doc.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
    lastEdited: formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true }),
    wordCount: doc.content.split(/\s+/).length,
  }));

  const formattedProjects = (projects || []).map((proj) => ({
    id: proj.id,
    title: proj.title,
    documentCount: proj.chapters?.length || 0,
    lastEdited: formatDistanceToNow(new Date(proj.updatedAt), { addSuffix: true }),
  }));

  return (
    <Dashboard
      documents={formattedDocuments}
      projects={formattedProjects}
      userEmail={user?.email || ""}
      userRole={user?.role}
      onCreateDocument={handleCreateDocument}
      onCreateProject={handleCreateProject}
      onOpenDocument={handleOpenDocument}
      onOpenProject={handleOpenProject}
      onRenameDocument={handleRenameDocument}
      onDeleteDocument={handleDeleteDocument}
      onRenameProject={handleRenameProject}
      onDeleteProject={handleDeleteProject}
      onLogout={handleLogout}
      onImportFile={handleImportFile}
    />
  );
}
