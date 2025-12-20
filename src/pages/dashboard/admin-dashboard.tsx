import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/lib/auth-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FolderKanban,
  Globe,
  TrendingUp,
  Activity,
  Server,
} from "lucide-react";
import type { UserSafe } from "@shared/schema";
import { format } from "date-fns";

const mockUserGrowthData = [
  { name: "Jan", value: 45 },
  { name: "Feb", value: 52 },
  { name: "Mar", value: 78 },
  { name: "Apr", value: 95 },
  { name: "May", value: 120 },
  { name: "Jun", value: 156 },
];

const mockProjectCreationData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 28 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 5 },
];

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthorized } = useRequireAuth("ADMIN");

  if (authLoading || !isAuthorized) {
    return null;
  }

  const { data: adminStats, isLoading: statsLoading } = useQuery<{
    totalUsers: number;
    totalProjects: number;
    publishedSites: number;
    activeUsers: number;
  }>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user,
  });

  const { data: recentUsers, isLoading: usersLoading } = useQuery<UserSafe[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-admin-title">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and management
        </p>
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
              title="Total Users"
              value={adminStats?.totalUsers || 0}
              icon={Users}
              trend={{ value: 18, isPositive: true }}
            />
            <StatsCard
              title="Total Projects"
              value={adminStats?.totalProjects || 0}
              icon={FolderKanban}
              trend={{ value: 24, isPositive: true }}
            />
            <StatsCard
              title="Published Sites"
              value={adminStats?.publishedSites || 0}
              icon={Globe}
            />
            <StatsCard
              title="Active Users"
              value={adminStats?.activeUsers || 0}
              icon={Activity}
              description="Last 7 days"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="User Growth"
          description="New user registrations over time"
          data={mockUserGrowthData}
          type="area"
        />
        <ChartCard
          title="Project Activity"
          description="Projects created this week"
          data={mockProjectCreationData}
          type="bar"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden sm:table-cell">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers && recentUsers.length > 0 ? (
                      recentUsers.slice(0, 5).map((user) => (
                        <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl || ""} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.role === "ADMIN" ? "default" : "secondary"}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <p className="text-muted-foreground">No users yet</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">API Server</p>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Online
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">PostgreSQL</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Healthy
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">CDN</p>
                  <p className="text-sm text-muted-foreground">Edge locations active</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
