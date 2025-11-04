import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NovaWriter. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors" 
              data-testid="link-privacy"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors" 
              data-testid="link-contact"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
