import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Sparkles, Trash2, FileText, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { WritingSample, StyleProfile } from "@shared/schema";

export default function WritingStylePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [sampleTitle, setSampleTitle] = useState("");
  const [sampleContent, setSampleContent] = useState("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const isFreeUser = user.subscriptionTier === "free";

  const { data: samples = [], isLoading: samplesLoading } = useQuery<WritingSample[]>({
    queryKey: ["/api/writing-samples"],
    enabled: !isFreeUser,
  });

  const { data: styleProfile, isLoading: profileLoading } = useQuery<StyleProfile | null>({
    queryKey: ["/api/style-profile"],
    enabled: !isFreeUser,
  });

  const createSampleMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      apiRequest("POST", "/api/writing-samples", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/writing-samples"] });
      setSampleTitle("");
      setSampleContent("");
    },
  });

  const deleteSampleMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/writing-samples/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/writing-samples"] });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/style-profile/analyze", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/style-profile"] });
    },
  });

  const handleSubmitSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (sampleTitle.trim() && sampleContent.trim()) {
      createSampleMutation.mutate({
        title: sampleTitle,
        content: sampleContent,
      });
    }
  };

  if (isFreeUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Writing Style Learning</h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")} data-testid="button-back">
              Back to Dashboard
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Writing style learning is only available for Basic and Pro tier subscribers.{" "}
              <button
                className="underline underline-offset-4 hover:text-primary cursor-pointer"
                onClick={() => navigate("/subscribe")}
                data-testid="button-upgrade"
              >
                Upgrade now
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Writing Style Learning</h1>
            <p className="text-muted-foreground">
              Upload your writing samples to teach the AI your unique voice
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")} data-testid="button-back">
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Writing Sample
                </CardTitle>
                <CardDescription>
                  Add examples of your own writing to help the AI learn your style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSample} className="space-y-4">
                  <div>
                    <Label htmlFor="title" data-testid="label-sample-title">Title</Label>
                    <Input
                      id="title"
                      value={sampleTitle}
                      onChange={(e) => setSampleTitle(e.target.value)}
                      placeholder="Sample title"
                      data-testid="input-sample-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content" data-testid="label-sample-content">
                      Content (minimum 100 words recommended)
                    </Label>
                    <Textarea
                      id="content"
                      value={sampleContent}
                      onChange={(e) => setSampleContent(e.target.value)}
                      placeholder="Paste your writing sample here..."
                      className="min-h-[200px]"
                      data-testid="textarea-sample-content"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createSampleMutation.isPending || !sampleTitle.trim() || !sampleContent.trim()}
                    className="w-full"
                    data-testid="button-upload-sample"
                  >
                    {createSampleMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Sample
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Writing Samples ({samples.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {samplesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : samples.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8" data-testid="text-no-samples">
                    No samples uploaded yet. Upload at least one sample to analyze your style.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {samples.map((sample) => (
                      <div
                        key={sample.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                        data-testid={`sample-${sample.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" data-testid={`sample-title-${sample.id}`}>
                            {sample.title}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`sample-words-${sample.id}`}>
                            {sample.wordCount} words
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSampleMutation.mutate(sample.id)}
                          disabled={deleteSampleMutation.isPending}
                          data-testid={`button-delete-sample-${sample.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Style Analysis
                </CardTitle>
                <CardDescription>
                  Analyze your writing samples to create a personalized style profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => analyzeMutation.mutate()}
                  disabled={analyzeMutation.isPending || samples.length === 0}
                  className="w-full mb-4"
                  data-testid="button-analyze-style"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {styleProfile ? "Re-analyze" : "Analyze"} Writing Style
                    </>
                  )}
                </Button>

                {samples.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Upload at least one writing sample to enable analysis
                  </p>
                )}
              </CardContent>
            </Card>

            {profileLoading ? (
              <Card>
                <CardContent className="py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ) : styleProfile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Writing Style Profile</CardTitle>
                  <CardDescription>
                    AI will use this profile to match your unique voice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid="badge-tone">Tone</Badge>
                    </div>
                    <p className="text-sm" data-testid="text-tone">{styleProfile.tone}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid="badge-vocabulary">Vocabulary</Badge>
                    </div>
                    <p className="text-sm" data-testid="text-vocabulary">{styleProfile.vocabulary}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid="badge-sentence">Sentence Structure</Badge>
                    </div>
                    <p className="text-sm" data-testid="text-sentence">{styleProfile.sentenceStructure}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid="badge-pacing">Pacing</Badge>
                    </div>
                    <p className="text-sm" data-testid="text-pacing">{styleProfile.pacing}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-muted-foreground text-center" data-testid="text-no-profile">
                    No style profile yet. Upload samples and click "Analyze Writing Style" to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
