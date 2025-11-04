import { Dashboard } from "../Dashboard";
import { ThemeProvider } from "../ThemeProvider";

export default function DashboardExample() {
  const documents = [
    {
      id: "doc-1",
      title: "The Great Adventure",
      preview: "Chapter one begins with our hero embarking on an unexpected journey...",
      lastEdited: "2 hours ago",
      wordCount: 3542,
    },
    {
      id: "doc-2",
      title: "Research Notes",
      preview: "Key findings from the latest study on creative writing techniques...",
      lastEdited: "Yesterday",
      wordCount: 1823,
    },
    {
      id: "doc-3",
      title: "Blog Post Draft",
      preview: "10 tips for improving your writing workflow and staying productive...",
      lastEdited: "3 days ago",
      wordCount: 892,
    },
  ];

  const projects = [
    {
      id: "proj-1",
      title: "Science Fiction Novel",
      documentCount: 12,
      lastEdited: "Today",
    },
    {
      id: "proj-2",
      title: "Short Story Collection",
      documentCount: 5,
      lastEdited: "Yesterday",
    },
  ];

  return (
    <ThemeProvider>
      <Dashboard
        documents={documents}
        projects={projects}
        userEmail="writer@novawrite.com"
        onCreateDocument={() => console.log("Create document")}
        onCreateProject={() => console.log("Create project")}
        onOpenDocument={(id) => console.log("Open document:", id)}
        onOpenProject={(id) => console.log("Open project:", id)}
        onRenameDocument={(id) => console.log("Rename document:", id)}
        onDeleteDocument={(id) => console.log("Delete document:", id)}
        onLogout={() => console.log("Logout")}
      />
    </ThemeProvider>
  );
}
