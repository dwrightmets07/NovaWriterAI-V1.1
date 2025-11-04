import { useState, useEffect, useRef } from "react";
import { TipTapEditor } from "@/components/TipTapEditor";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AutosaveIndicator } from "@/components/AutosaveIndicator";
import { useLocation, Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TrialEditorPage() {
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem("trial-editor-content");
    if (savedContent) {
      setContent(savedContent);
      setAutosaveStatus("saved");
    }
  }, []);

  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    if (autosaveStatus === "unsaved") {
      autosaveTimerRef.current = setTimeout(() => {
        setAutosaveStatus("saving");
        localStorage.setItem("trial-editor-content", content);
        setAutosaveStatus("saved");
      }, 2000);
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [content, autosaveStatus]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setAutosaveStatus("unsaved");
  };

  const handleSignup = () => {
    setLocation("/auth?mode=register");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/">
            <h1 className="text-xl font-bold text-primary flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-logo-trial">
              NovaWriter
            </h1>
          </Link>
          <div className="hidden sm:block text-muted-foreground">|</div>
          <span className="hidden sm:block text-sm text-muted-foreground">
            Free Trial Editor
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <AutosaveIndicator status={autosaveStatus} />

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSignupPrompt(true)}
            data-testid="button-trial-ai"
            title="Sign up for AI features"
          >
            <Sparkles className="h-5 w-5 text-chart-2" />
          </Button>

          <Button
            onClick={handleSignup}
            size="sm"
            data-testid="button-trial-signup"
          >
            Sign Up to Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TipTapEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Try NovaWriter - Start writing for free! (Note: Your work is saved locally. Sign up to save to cloud and access more features.)"
        />
      </div>

      <AlertDialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign up for full features</AlertDialogTitle>
            <AlertDialogDescription>
              The Writing Assistant and other advanced features are available to registered users.
              Sign up now to unlock the full power of NovaWriter!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Trial</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignup}>Sign Up Free</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
