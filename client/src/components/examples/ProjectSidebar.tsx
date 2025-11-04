import { ProjectSidebar } from "../ProjectSidebar";

export default function ProjectSidebarExample() {
  const projects = [
    {
      id: "proj-1",
      title: "Science Fiction Novel",
      chapters: [
        { id: "ch-1", title: "Chapter 1: The Beginning" },
        { id: "ch-2", title: "Chapter 2: Discovery" },
        { id: "ch-3", title: "Chapter 3: The Journey" },
      ],
    },
    {
      id: "proj-2",
      title: "Research Papers",
      chapters: [
        { id: "ch-4", title: "Introduction" },
        { id: "ch-5", title: "Methodology" },
      ],
    },
  ];

  return (
    <div className="h-screen w-64">
      <ProjectSidebar
        projects={projects}
        activeChapterId="ch-1"
        onSelectChapter={(projectId, chapterId) =>
          console.log("Select:", projectId, chapterId)
        }
        onAddChapter={(projectId) => console.log("Add chapter to:", projectId)}
        onAddProject={() => console.log("Add new project")}
      />
    </div>
  );
}
