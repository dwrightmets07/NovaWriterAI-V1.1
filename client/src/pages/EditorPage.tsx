import { useState, useEffect, useRef } from "react";
import { TipTapEditor } from "@/components/TipTapEditor";
import { TopBar } from "@/components/TopBar";
import { AIAssistant } from "@/components/AIAssistant";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/lib/auth";
import { useDocument, useUpdateDocument, useDocuments, useCreateDocument, useDeleteDocument } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function EditorPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: document, isLoading: documentLoading } = useDocument(id);
  const { data: documents, isLoading: documentsLoading } = useDocuments();
  const updateDocumentMutation = useUpdateDocument(id || "");
  const createDocumentMutation = useCreateDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const [content, setContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (document) {
      setContent(document.content);
      setDocumentTitle(document.title);
    }
  }, [document]);

  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    if (autosaveStatus === "unsaved") {
      autosaveTimerRef.current = setTimeout(async () => {
        setAutosaveStatus("saving");
        try {
          await updateDocumentMutation.mutateAsync({
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
  }, [content, documentTitle, autosaveStatus, updateDocumentMutation]);

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

  const handleSelectDocument = (docId: string) => {
    setLocation(`/editor/${docId}`);
  };

  const handleAddDocument = async () => {
    try {
      const doc = await createDocumentMutation.mutateAsync({
        title: "Untitled Document",
        content: "<p>Start writing...</p>",
      });
      // Document list will auto-update via query invalidation in mutation
      setLocation(`/editor/${doc.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create document",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (docId === id) {
      toast({
        variant: "destructive",
        title: "Cannot delete",
        description: "Cannot delete the currently open document",
      });
      return;
    }
    
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocumentMutation.mutateAsync(docId);
        // Document list will auto-update via query invalidation in mutation
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

  if (authLoading || documentLoading || documentsLoading) {
    return null;
  }

  const formattedDocuments = (documents || []).map((doc) => ({
    id: doc.id,
    title: doc.title,
  }));

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

      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <div className="w-64 hidden lg:block">
            <DocumentSidebar
              documents={formattedDocuments}
              activeDocumentId={id}
              onSelectDocument={handleSelectDocument}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
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
