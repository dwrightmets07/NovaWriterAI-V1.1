import { Card, CardContent } from "@/components/ui/card";
import { PenTool, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="heading-about">About NovaWriter</h1>
        <p className="text-xl text-muted-foreground italic">
          By writers, for writers
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-12">
        <p className="text-lg leading-relaxed">
          NovaWriter was created by writers who understand the unique challenges of crafting 
          stories, articles, and ideas in our free time. We know what it's like to have a 
          burst of inspiration on your lunch break, continue writing on your commute home, 
          and polish your work late at night on a different device.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          That's why we built NovaWriter: a seamless writing platform that lets you pick up 
          exactly where you left off, no matter which device you're on. Whether you're writing 
          your first blog post or your fifth novel, NovaWriter keeps your creative flow 
          uninterrupted.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Distraction-Free Writing</h3>
            <p className="text-sm text-muted-foreground">
              A clean, intuitive editor designed to help you focus on what matters: your words.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Built by Writers</h3>
            <p className="text-sm text-muted-foreground">
              Every feature is designed with real writers in mind, not just tech specifications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cross-Device Sync</h3>
            <p className="text-sm text-muted-foreground">
              Start on your laptop, continue on your tablet, finish on your phone. Seamlessly.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              We're a small team of passionate writers and developers who got tired of clunky 
              writing tools that didn't understand our workflow. We wanted something simple yet 
              powerful, accessible yet feature-rich.
            </p>
            <p>
              NovaWrite was born from late-night writing sessions, countless cups of coffee, 
              and the shared frustration of losing our place in a story when switching devices. 
              We built the tool we wished we had, and now we're sharing it with fellow writers 
              everywhere.
            </p>
            <p>
              Whether you're drafting your first short story or managing a complex novel with 
              multiple chapters, NovaWrite is here to support your creative journey. Because at 
              the end of the day, we're writers just like you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
