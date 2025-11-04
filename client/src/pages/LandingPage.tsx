import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, FolderOpen, Download, Moon, Sun, BookOpen, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-logo-landing">
              <h1 className="text-2xl font-bold">NovaWriter</h1>
              <p className="text-sm text-muted-foreground">For Writers, By Writers.</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/about" data-testid="link-about-landing">
                About
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/contact" data-testid="link-contact-landing">
                Contact
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/auth?mode=login")}
              data-testid="button-login"
            >
              Log In
            </Button>
            <Button
              onClick={() => setLocation("/auth?mode=register")}
              data-testid="button-signup"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Write Better, Faster
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern writing platform designed for all writers. Create documents, organize projects,
            and enhance your writing with intelligent assistance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => setLocation("/trial")}
              data-testid="button-try-editor"
            >
              Try Editor Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/auth?mode=register")}
              data-testid="button-get-started"
            >
              Sign Up Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/auth?mode=login")}
              data-testid="button-login-main"
            >
              Log In
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <FileText className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Rich Text Editor</h3>
              <p className="text-sm text-muted-foreground">
                Powerful formatting tools with a clean, distraction-free writing experience
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <FolderOpen className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Project Organization</h3>
              <p className="text-sm text-muted-foreground">
                Organize your work into projects and chapters for novels, books, or long-form content
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <Sparkles className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Writing Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent suggestions to improve, continue, or rewrite your content
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <Download className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Import & Export</h3>
              <p className="text-sm text-muted-foreground">
                Import .docx and .txt files, export your work as DOCX or PDF
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Works Written With NovaWriter</h3>
            <p className="text-lg text-muted-foreground">
              Real books created using our platform
            </p>
          </div>

          {/* Featured Published Book */}
          <Card className="hover-elevate mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="default" className="text-base px-4 py-1" data-testid="badge-published">
                  Published
                </Badge>
              </div>
              <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                <div className="mx-auto md:mx-0">
                  <img
                    src="https://m.media-amazon.com/images/I/91Qao-+7c8L._SY522_.jpg"
                    alt="Echoes of the Ancients book cover"
                    className="rounded-lg shadow-lg w-full max-w-[200px]"
                    data-testid="img-book-cover"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-3xl font-bold">Echoes of the Ancients</h4>
                  <p className="text-lg text-muted-foreground">
                    A Journey Through The World's First Civilizations
                  </p>
                  <p className="text-sm">
                    From the ziggurats of Mesopotamia to the pyramids of Egypt, from the vanished streets of the Indus to the high cities of the Andes—a fast, vivid tour of the world's earliest empires and why they still shape your life today.
                  </p>
                  <div className="flex gap-3 flex-wrap mt-2">
                    <a
                      href="https://www.amazon.com/Echoes-Ancients-Journey-Through-Civilizations-ebook/dp/B0FWXWXN5Z"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-echoes-amazon"
                    >
                      <Button variant="default" className="gap-2">
                        View on Amazon <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <a
                      href="https://www.etsy.com/listing/4389247621/echoes-of-the-ancients-ancient"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-echoes-etsy"
                    >
                      <Button variant="outline" className="gap-2">
                        View on Etsy <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Works in Progress */}
          <div className="text-center mb-4">
            <h4 className="text-xl font-semibold text-muted-foreground">Currently in Progress</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <Badge variant="secondary" data-testid="badge-in-progress-1">In Progress</Badge>
                </div>
                <h4 className="text-xl font-semibold mb-2">Disclosure Day</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Currently being written with NovaWriter
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <Badge variant="secondary" data-testid="badge-in-progress-2">In Progress</Badge>
                </div>
                <h4 className="text-xl font-semibold mb-2">Echoes of Ancient Greece</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Currently being written with NovaWriter
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center bg-muted rounded-lg p-12">
          <h3 className="text-3xl font-bold mb-4">Ready to start writing?</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Sign up now to access your documents, projects, and writing tools.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/auth?mode=register")}
            data-testid="button-signup-footer"
          >
            Create Your Account
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
