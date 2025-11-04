import { useState } from "react";
import { AIAssistant } from "../AIAssistant";
import { Button } from "@/components/ui/button";

export default function AIAssistantExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative h-screen">
      <div className="p-4">
        <Button onClick={() => setIsOpen(!isOpen)}>
          Toggle AI Assistant
        </Button>
      </div>
      <AIAssistant
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={(text) => console.log("Applied:", text)}
      />
    </div>
  );
}
