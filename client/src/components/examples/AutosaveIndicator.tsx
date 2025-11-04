import { useState, useEffect } from "react";
import { AutosaveIndicator } from "../AutosaveIndicator";

export default function AutosaveIndicatorExample() {
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus("saving");
      setTimeout(() => setStatus("saved"), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <AutosaveIndicator status={status} />
    </div>
  );
}
