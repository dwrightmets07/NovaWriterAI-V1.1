import { useState } from "react";
import { X, Sparkles, Wand2, ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAISuggest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  content: string;
}

export function AIAssistant({ isOpen, onClose, onApply, content }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const aiSuggestMutation = useAISuggest();
  const { toast } = useToast();

  const quickActions = [
    { label: "Summarize", icon: Sparkles },
    { label: "Continue", icon: ArrowRight },
    { label: "Rewrite", icon: RotateCw },
    { label: "Improve", icon: Wand2 },
  ];

  const handleGenerate = async (action?: string) => {
    const finalPrompt = action || prompt;
    if (!finalPrompt) return;

    try {
      const suggestion = await aiSuggestMutation.mutateAsync({
        prompt: finalPrompt,
        content,
      });
      setResult(suggestion);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI generation failed",
        description: error instanceof Error ? error.message : "Failed to generate AI suggestion",
      });
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setResult("");
      setPrompt("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-14 bottom-0 w-80 border-l bg-background shadow-lg z-20 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-chart-2" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-ai"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            What would you like to do?
          </label>
          <Textarea
            placeholder="Enter your prompt... (e.g., 'Make this more professional')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
            data-testid="input-ai-prompt"
          />
          <Button
            onClick={() => handleGenerate()}
            disabled={!prompt || aiSuggestMutation.isPending}
            className="w-full mt-2"
            data-testid="button-generate-ai"
          >
            {aiSuggestMutation.isPending ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Quick Actions</label>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(action.label)}
                disabled={aiSuggestMutation.isPending}
                className="justify-start"
                data-testid={`button-quick-${action.label.toLowerCase()}`}
              >
                <action.icon className="h-3 w-3 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {result && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-chart-2">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Result
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {result}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                size="sm"
                className="flex-1"
                data-testid="button-apply-ai"
              >
                Apply
              </Button>
              <Button
                onClick={() => handleGenerate()}
                variant="outline"
                size="sm"
                disabled={aiSuggestMutation.isPending}
                data-testid="button-regenerate-ai"
              >
                <RotateCw className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
