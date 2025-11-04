import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AutosaveIndicatorProps {
  status: "saved" | "saving" | "unsaved";
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === "saved") {
    return (
      <Badge
        variant="outline"
        className="text-chart-3 border-chart-3/20"
        data-testid="status-saved"
      >
        <Check className="h-3 w-3 mr-1" />
        Saved
      </Badge>
    );
  }

  if (status === "saving") {
    return (
      <Badge
        variant="outline"
        className="text-chart-4 border-chart-4/20"
        data-testid="status-saving"
      >
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Saving...
      </Badge>
    );
  }

  return null;
}
