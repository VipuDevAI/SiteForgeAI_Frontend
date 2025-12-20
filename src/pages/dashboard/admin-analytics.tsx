import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/lib/auth-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FolderKanban,
  Globe,
  TrendingUp,
  Eye,
  Clock,
} from "lucide-react";

const mockMonthlyData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 180 },
  { name: "Mar", value: 245 },
  { name: "Apr", value: 310 },
  { name: "May", value: 420 },
  { name: "Jun", value: 580 },
  { name: "Jul", value: 650 },
  { name: "Aug", value: 720 },
  { name: "Sep", value: 810 },
  { name: "Oct", value: 950 },
  { name: "Nov", value: 1100 },
  { name: "Dec", value: 1280 },
];

const mockTrafficData = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 3200 },
  { name: "Wed", value: 2800 },
  { name: "Thu", value: 3600 },
  { name: "Fri", value: 4200 },
  { name: "Sat", value: 2100 },
  { name: "Sun", value: 1800 },
];

const mockConversionData = [
  { name: "Jan", value: 2.4 },
  { name: "Feb", value: 2.8 },
  { name: "Mar", value: 3.2 },
  { name: "Apr", value: 3.5 },
  { name: "May", value: 4.1 },
  { name: "Jun", value: 4.8 },
];

export default function AdminAnalyticsPage() {
  const { user, isLoading: authLoading, isAuthorized } = useRequireAuth("ADMIN");

  const { data: stats, isLoading } = useQuery<{
    totalUsers: number;
    totalProjects: number;
    publishedSites: number;
    pageViews: number;
    avgSessionDuration: string;
    conversionRate: string;
  }>({
    queryKey: ["/api/admin/analytics"],
    enabled: !!user && isAuthorized,
  });

  if (authLoading || !isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-admin-analytics-title">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform performance metrics and insights
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
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
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              trend={{ value: 18, isPositive: true }}
            />
            <StatsCard
              title="Total Projects"
              value={stats?.totalProjects || 0}
              icon={FolderKanban}
              trend={{ value: 24, isPositive: true }}
            />
            <StatsCard
              title="Published Sites"
              value={stats?.publishedSites || 0}
              icon={Globe}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Page Views"
              value={stats?.pageViews?.toLocaleString() || "0"}
              icon={Eye}
              description="Last 30 days"
            />
            <StatsCard
              title="Avg. Session"
              value={stats?.avgSessionDuration || "0m"}
              icon={Clock}
            />
            <StatsCard
              title="Conversion Rate"
              value={stats?.conversionRate || "0%"}
              icon={TrendingUp}
              trend={{ value: 0.5, isPositive: true }}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="User Growth"
          description="Total registered users over time"
          data={mockMonthlyData}
          type="area"
        />
        <ChartCard
          title="Weekly Traffic"
          description="Page views this week"
          data={mockTrafficData}
          type="bar"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Conversion Rate"
          description="Signup to active user conversion"
          data={mockConversionData}
          type="area"
        />
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Landing Page", views: 12453, change: "+15%" },
                { title: "Template Gallery", views: 8234, change: "+8%" },
                { title: "Pricing Page", views: 5621, change: "+22%" },
                { title: "Documentation", views: 3892, change: "+5%" },
                { title: "Blog", views: 2156, change: "+12%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {i + 1}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {item.views.toLocaleString()} views
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
