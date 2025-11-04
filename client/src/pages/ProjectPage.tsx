import { useState, useEffect, useRef } from "react";
import { TipTapEditor } from "@/components/TipTapEditor";
import { TopBar } from "@/components/TopBar";
import { AIAssistant } from "@/components/AIAssistant";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/lib/auth";
import { useProject, useChapter, useUpdateChapter, useCreateChapter, useCreateProject, useDeleteChapter } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ProjectPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: project, isLoading: projectLoading } = useProject(id);
  const createChapterMutation = useCreateChapter();
  const createProjectMutation = useCreateProject();
  const deleteChapterMutation = useDeleteChapter();

  const [content, setContent] = useState("<p>Chapter content goes here...</p>");
  const [documentTitle, setDocumentTitle] = useState("Chapter");
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState("");
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: activeChapter } = useChapter(activeChapterId || undefined);
  const updateChapterMutation = useUpdateChapter(activeChapterId);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (project && project.chapters && project.chapters.length > 0 && !activeChapterId) {
      setActiveChapterId(project.chapters[0].id);
    }
  }, [project, activeChapterId]);

  useEffect(() => {
    if (activeChapter) {
      setContent(activeChapter.content);
      setDocumentTitle(activeChapter.title);
    }
  }, [activeChapter]);

  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    if (autosaveStatus === "unsaved" && activeChapterId) {
      autosaveTimerRef.current = setTimeout(async () => {
        setAutosaveStatus("saving");
        try {
          await updateChapterMutation.mutateAsync({
            title: documentTitle,
            content,
          });
          setAutosaveStatus("saved");
        } catch (error) {
          setAutosaveStatus("unsaved");
        }
      }, 2000);
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [content, documentTitle, autosaveStatus, activeChapterId, updateChapterMutation]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setAutosaveStatus("unsaved");
  };

  const handleTitleChange = (newTitle: string) => {
    setDocumentTitle(newTitle);
    setAutosaveStatus("unsaved");
  };

  const handleContentImport = (importedContent: string) => {
    setContent(importedContent);
    setAutosaveStatus("unsaved");
  };

  const handleApplyAI = (text: string) => {
    setContent((prev) => prev + "\n\n" + text);
    setAutosaveStatus("unsaved");
  };

  const handleSelectChapter = (projectId: string, chapterId: string) => {
    setActiveChapterId(chapterId);
  };

  const handleAddChapter = async (projectId: string) => {
    try {
      const chapterCount = project?.chapters?.length || 0;
      await createChapterMutation.mutateAsync({
        projectId,
        title: `Chapter ${chapterCount + 1}`,
        content: "<p>Start writing...</p>",
        orderIndex: chapterCount,
      });
      toast({
        title: "Chapter created",
        description: "New chapter has been created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create chapter",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (chapterId === activeChapterId) {
      toast({
        variant: "destructive",
        title: "Cannot delete",
        description: "Cannot delete the currently open chapter",
      });
      return;
    }

    if (confirm("Are you sure you want to delete this chapter?")) {
      try {
        await deleteChapterMutation.mutateAsync(chapterId);
        toast({
          title: "Chapter deleted",
          description: "Chapter has been deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete chapter",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      }
    }
  };

  const handleAddProject = async () => {
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

  if (authLoading || projectLoading) {
    return null;
  }

  const projects = project ? [{
    id: project.id,
    title: project.title,
    chapters: (project.chapters || []).map((ch) => ({
      id: ch.id,
      title: ch.title,
    })),
  }] : [];

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        documentTitle={documentTitle}
        autosaveStatus={autosaveStatus}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        userEmail={user?.email || ""}
        onLogout={handleLogout}
        content={content}
        onContentImport={handleContentImport}
        onTitleChange={handleTitleChange}
        isEditable={true}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          transition-transform duration-300 ease-in-out
          fixed lg:relative
          w-64 h-full
          z-50 lg:z-0
          bg-background
        `}>
          <ProjectSidebar
            projects={projects}
            activeChapterId={activeChapterId}
            onSelectChapter={(projectId, chapterId) => {
              handleSelectChapter(projectId, chapterId);
              setIsSidebarOpen(false);
            }}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            sidebarTitle="Chapters"
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing this chapter..."
          />
        </div>

        <AIAssistant
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          onApply={handleApplyAI}
          content={content}
        />
      </div>
    </div>
  );
}
