import { Link } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Have questions or concerns? We're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-muted-foreground mb-2">
                  If you have questions or concerns, contact us at:
                </p>
                <a
                  href="mailto:novawriter25@gmail.com"
                  className="text-primary hover:underline text-lg font-medium"
                  data-testid="link-contact-email"
                >
                  novawriter25@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">What to Include</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Your account email (if applicable)</li>
                <li>A detailed description of your question or issue</li>
                <li>Any relevant screenshots or error messages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
