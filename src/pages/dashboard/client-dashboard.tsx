import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/lib/auth-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  FolderKanban,
  Globe,
  Layout,
  HardDrive,
  Sparkles,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react";
import type { Project } from "@shared/schema";

export default function ClientDashboard() {
  const { user, isLoading: authLoading, isAuthorized } = useRequireAuth("CLIENT");

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!user && isAuthorized,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalProjects: number;
    publishedSites: number;
    templatesUsed: number;
    storageUsed: string;
  }>({
    queryKey: ["/api/stats"],
    enabled: !!user && isAuthorized,
  });

  const { data: aiUsage, isLoading: aiUsageLoading } = useQuery<{
    used: number;
    limit: number;
    remaining: number;
  }>({
    queryKey: ["/api/ai/usage"],
    enabled: !!user && isAuthorized,
  });

  if (authLoading || !isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-welcome">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your projects
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new" data-testid="button-new-project">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Projects"
              value={stats?.totalProjects || 0}
              icon={FolderKanban}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Published Sites"
              value={stats?.publishedSites || 0}
              icon={Globe}
            />
            <StatsCard
              title="Templates Used"
              value={stats?.templatesUsed || 0}
              icon={Layout}
            />
            <StatsCard
              title="Storage Used"
              value={stats?.storageUsed || "0 MB"}
              icon={HardDrive}
            />
          </>
        )}
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10" data-testid="card-ai-credits">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Generation Credits</CardTitle>
            </div>
            {aiUsage && aiUsage.remaining === 0 && (
              <Button size="sm" variant="default" data-testid="button-upgrade-plan" asChild>
                <Link href="/dashboard/upgrade">Upgrade Plan</Link>
              </Button>
            )}
          </div>
          <CardDescription>
            Generate websites, content, and designs with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiUsageLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : aiUsage ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground" data-testid="text-ai-usage">
                  {aiUsage.used} of {aiUsage.limit} generations used
                </span>
                <span className="font-medium text-primary" data-testid="text-ai-remaining">
                  {aiUsage.remaining} remaining
                </span>
              </div>
              <Progress 
                value={(aiUsage.used / aiUsage.limit) * 100} 
                className="h-2"
                data-testid="progress-ai-usage"
              />
              {aiUsage.remaining <= 1 && aiUsage.remaining > 0 && (
                <p className="text-xs text-muted-foreground">
                  Running low on credits. Upgrade for unlimited AI generations.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground" data-testid="text-ai-default">3 free generations available</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickActionCard
          title="AI Site Generator"
          description="Describe your vision and let AI create a stunning website for you."
          icon={Sparkles}
          href="/dashboard/projects/new"
          variant="primary"
        />
        <QuickActionCard
          title="Browse Templates"
          description="Choose from hundreds of professionally designed templates."
          icon={Layout}
          href="/dashboard/templates"
        />
        <QuickActionCard
          title="Manage Media"
          description="Upload and organize images, videos, and other assets."
          icon={HardDrive}
          href="/dashboard/media"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Recent Projects</CardTitle>
          {projects && projects.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <ProjectsTable projects={projects.slice(0, 5)} />
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project and start building your website with AI."
              actionLabel="Create Project"
              actionHref="/dashboard/projects/new"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
