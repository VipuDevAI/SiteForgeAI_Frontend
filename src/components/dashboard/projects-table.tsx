import { Link } from "wouter";
import { format } from "date-fns";
import type { Project } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink, Edit, Trash2 } from "lucide-react";

interface ProjectsTableProps {
  projects: Project[];
  onDelete?: (id: string) => void;
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  published: "default",
  archived: "outline",
};

export function ProjectsTable({ projects, onDelete }: ProjectsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Domain</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} data-testid={`project-row-${project.id}`}>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="font-medium hover:underline"
                    data-testid={`link-project-${project.id}`}
                  >
                    {project.name}
                  </Link>
                  {project.description && (
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[project.status]}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {project.domain ? (
                  <a
                    href={`https://${project.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {project.domain}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(project.createdAt), "MMM d, yyyy")}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`button-project-menu-${project.id}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(project.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
