import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "default" | "primary";
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "default",
}: QuickActionCardProps) {
  const isPrimary = variant === "primary";

  return (
    <Card
      className={`overflow-visible hover-elevate ${
        isPrimary ? "bg-primary text-primary-foreground" : ""
      }`}
      data-testid={`quick-action-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
              isPrimary
                ? "bg-primary-foreground/10"
                : "bg-muted"
            }`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold">{title}</h3>
            <p
              className={`text-sm ${
                isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button
            asChild
            variant={isPrimary ? "secondary" : "default"}
            className="w-full"
          >
            <Link href={href} data-testid={`link-${title.toLowerCase().replace(/\s+/g, "-")}`}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
