interface WordCounterProps {
  content: string;
}

export function WordCounter({ content }: WordCounterProps) {
  const text = content.replace(/<[^>]*>/g, "").trim();
  const words = text.length > 0 ? text.split(/\s+/).length : 0;
  const characters = text.length;

  return (
    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground" data-testid="word-counter">
      <span className="hidden sm:inline">
        <span className="font-medium">{words.toLocaleString()}</span> words
      </span>
      <span className="text-muted-foreground/50 hidden sm:inline">•</span>
      <span>
        <span className="font-medium">{characters.toLocaleString()}</span> <span className="hidden sm:inline">characters</span><span className="sm:hidden">ch</span>
      </span>
    </div>
  );
}
