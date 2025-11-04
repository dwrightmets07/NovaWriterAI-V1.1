import { useState } from "react";
import { TipTapEditor } from "../TipTapEditor";

export default function TipTapEditorExample() {
  const [content, setContent] = useState("<p>Start writing your masterpiece...</p>");

  return (
    <div className="h-screen">
      <TipTapEditor
        content={content}
        onChange={setContent}
        placeholder="Start writing..."
      />
    </div>
  );
}
