import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { getApiUrl } from "./config";
import type { Document, Project, Chapter } from "@shared/schema";

export function useDocuments() {
  return useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });
}

export function useDocument(id: string | undefined) {
  return useQuery<Document>({
    queryKey: ["/api/documents", id],
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content?: string }) => {
      const res = await apiRequest("POST", "/api/documents", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });
}

export function useUpdateDocument(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<{ title: string; content: string }>) => {
      const res = await apiRequest("PATCH", `/api/documents/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents", id] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });
}

export function useProjects() {
  return useQuery<(Project & { chapters?: Chapter[] })[]>({
    queryKey: ["/api/projects"],
  });
}

export function useProject(id: string | undefined) {
  return useQuery<Project & { chapters: Chapter[] }>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string }) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<{ title: string }>) => {
      const res = await apiRequest("PATCH", `/api/projects/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useChapters(projectId: string | undefined) {
  return useQuery<Chapter[]>({
    queryKey: ["/api/projects", projectId, "chapters"],
    enabled: !!projectId,
  });
}

export function useChapter(id: string | undefined) {
  return useQuery<Chapter>({
    queryKey: ["/api/chapters", id],
    enabled: !!id,
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { projectId: string; title: string; content?: string; orderIndex: number }) => {
      const res = await apiRequest("POST", "/api/chapters", data);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId, "chapters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId] });
    },
  });
}

export function useUpdateChapter(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<{ title: string; content: string; orderIndex: number }>) => {
      const res = await apiRequest("PATCH", `/api/chapters/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chapters", id] });
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/chapters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useAISuggest() {
  return useMutation({
    mutationFn: async (data: { prompt: string; content: string }) => {
      const res = await apiRequest("POST", "/api/ai/suggest", data);
      const result = await res.json();
      return result.suggestion;
    },
  });
}

export async function importFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(getApiUrl("/api/import"), {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to import file: ${errorText}`);
  }
  
  const data = await response.json();
  return data.content;
}

export async function exportDocx(title: string, content: string) {
  const response = await fetch(getApiUrl("/api/export/docx"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to export document: ${errorText}`);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportPdf(title: string, content: string) {
  const response = await fetch(getApiUrl("/api/export/pdf"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to export document: ${errorText}`);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}
