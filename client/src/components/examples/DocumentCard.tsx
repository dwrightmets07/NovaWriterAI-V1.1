import { DocumentCard } from "../DocumentCard";

export default function DocumentCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <DocumentCard
        id="doc-1"
        title="My First Novel"
        preview="It was a dark and stormy night when everything changed. The protagonist faced their greatest challenge yet..."
        lastEdited="2 hours ago"
        wordCount={2543}
        onClick={() => console.log("Open document")}
        onRename={() => console.log("Rename document")}
        onDelete={() => console.log("Delete document")}
      />
    </div>
  );
}
