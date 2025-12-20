import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import DashboardLayout from "@/pages/dashboard/layout";
import ClientDashboard from "@/pages/dashboard/client-dashboard";
import AdminDashboard from "@/pages/dashboard/admin-dashboard";
import ProjectsPage from "@/pages/dashboard/projects";
import NewProjectPage from "@/pages/dashboard/new-project";
import TemplatesPage from "@/pages/dashboard/templates";
import MediaPage from "@/pages/dashboard/media";
import ProfilePage from "@/pages/dashboard/profile";
import AdminUsersPage from "@/pages/dashboard/admin-users";
import AdminAnalyticsPage from "@/pages/dashboard/admin-analytics";
import AdminSettingsPage from "@/pages/dashboard/admin-settings";
import UpgradePage from "@/pages/dashboard/upgrade";
import WebsiteBuilder from "@/pages/dashboard/website-builder";
import WebsiteEditor from "@/pages/dashboard/website-editor";
import { useEffect } from "react";

function DashboardRoute() {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <AdminDashboard /> : <ClientDashboard />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/dashboard">
        <DashboardLayout title="Dashboard">
          <DashboardRoute />
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/projects">
        <DashboardLayout title="Projects">
          <ProjectsPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/projects/new">
        <DashboardLayout title="New Project">
          <NewProjectPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/templates">
        <DashboardLayout title="Templates">
          <TemplatesPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/media">
        <DashboardLayout title="Media Library">
          <MediaPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/profile">
        <DashboardLayout title="Profile">
          <ProfilePage />
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/admin">
        <DashboardLayout title="Admin Dashboard">
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/admin/users">
        <DashboardLayout title="User Management">
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/admin/analytics">
        <DashboardLayout title="Analytics">
          <AdminRoute>
            <AdminAnalyticsPage />
          </AdminRoute>
        </DashboardLayout>
      </Route>
      
      <Route path="/dashboard/admin/settings">
        <DashboardLayout title="Settings">
          <AdminRoute>
            <AdminSettingsPage />
          </AdminRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/upgrade">
        <DashboardLayout title="Upgrade Plan">
          <UpgradePage />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/builder">
        <DashboardLayout title="AI Website Builder">
          <WebsiteBuilder />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/editor/:id">
        <DashboardLayout title="Website Editor">
          <WebsiteEditor />
        </DashboardLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="siteforgeai-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
