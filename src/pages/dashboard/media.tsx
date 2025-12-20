import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Image, Search, Upload, File, Film, Music } from "lucide-react";
import type { Media } from "@shared/schema";
import { useState } from "react";
import { format } from "date-fns";

const getMediaIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Film;
  if (type.startsWith("audio/")) return Music;
  return File;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function MediaPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mediaItems, isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
    enabled: !!token,
  });

  const filteredMedia = mediaItems?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-media-title">
            Media Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your images, videos, and files
          </p>
        </div>
        <Button data-testid="button-upload-media">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-media"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMedia && filteredMedia.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMedia.map((item) => {
            const Icon = getMediaIcon(item.type);
            return (
              <Card
                key={item.id}
                className="group overflow-hidden hover-elevate"
                data-testid={`media-card-${item.id}`}
              >
                <div className="relative aspect-square bg-muted">
                  {item.type.startsWith("image/") ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-medium truncate text-sm">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatBytes(item.size)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Image}
          title={searchQuery ? "No files found" : "No files uploaded"}
          description={
            searchQuery
              ? "Try adjusting your search query."
              : "Upload your first file to get started."
          }
          actionLabel={searchQuery ? undefined : "Upload Files"}
          onAction={searchQuery ? undefined : () => {}}
        />
      )}
    </div>
  );
}
