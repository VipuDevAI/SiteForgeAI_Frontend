import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  RefreshCw, 
  Loader2, 
  Monitor, 
  Tablet, 
  Smartphone,
  ExternalLink,
  Code,
  Wand2,
  Check
} from "lucide-react";
import type { Project } from "@shared/schema";

type ViewMode = "desktop" | "tablet" | "mobile";

export default function WebsiteEditor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { token } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [instructions, setInstructions] = useState("");

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
  });

  const regenerateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/website/regenerate", {
        projectId: id,
        sectionName,
        instructions,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({
        title: "Section Updated!",
        description: "Your website has been regenerated with the changes.",
      });
      setRegenerateOpen(false);
      setSectionName("");
      setInstructions("");
    },
    onError: (error: Error) => {
      toast({
        title: "Regeneration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/projects/${id}`, {
        status: "published",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({
        title: "Website Published!",
        description: "Your website is now live.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    window.open(`/api/website/${id}/download`, "_blank");
  };

  const handlePreview = () => {
    window.open(`/api/website/${id}/preview`, "_blank");
  };

  const getIframeWidth = () => {
    switch (viewMode) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Project not found</p>
        <Button variant="outline" onClick={() => setLocation("/dashboard/projects")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const hasWebsite = project.generatedHtml && project.generatedHtml.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard/projects")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">
                {project.status === "published" ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Published
                  </span>
                ) : (
                  "Draft"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "desktop" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("desktop")}
                data-testid="view-desktop"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "tablet" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("tablet")}
                data-testid="view-tablet"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("mobile")}
                data-testid="view-mobile"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={regenerateOpen} onOpenChange={setRegenerateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!hasWebsite} data-testid="button-regenerate">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Modify Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modify Website Section</DialogTitle>
                  <DialogDescription>
                    Tell AI which section to modify and what changes you want.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Section Name</label>
                    <Input
                      placeholder="e.g., Hero, Features, Pricing, Footer"
                      value={sectionName}
                      onChange={(e) => setSectionName(e.target.value)}
                      data-testid="input-section-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Instructions</label>
                    <Textarea
                      placeholder="e.g., Make the hero section more bold, add a video background, change the color scheme..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="min-h-[100px]"
                      data-testid="input-instructions"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRegenerateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => regenerateMutation.mutate()}
                    disabled={regenerateMutation.isPending || !sectionName || !instructions}
                    data-testid="button-apply-changes"
                  >
                    {regenerateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Apply Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handlePreview} disabled={!hasWebsite} data-testid="button-preview">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>

            <Button variant="outline" onClick={handleDownload} disabled={!hasWebsite} data-testid="button-download">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>

            <Button 
              onClick={() => publishMutation.mutate()} 
              disabled={!hasWebsite || publishMutation.isPending || project.status === "published"}
              data-testid="button-publish"
            >
              {publishMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {project.status === "published" ? "Published" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-muted/30 p-6">
        {hasWebsite ? (
          <div className="h-full flex justify-center">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={{ 
                width: getIframeWidth(), 
                maxWidth: "100%",
                height: "100%",
              }}
            >
              <iframe
                srcDoc={project.generatedHtml + (project.generatedCss ? `<style>${project.generatedCss}</style>` : "")}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <Card className="max-w-md">
              <CardHeader className="text-center">
                <CardTitle>No Website Generated</CardTitle>
                <CardDescription>
                  This project doesn't have a generated website yet.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setLocation("/dashboard/builder")} data-testid="button-create-website">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Create Website
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
