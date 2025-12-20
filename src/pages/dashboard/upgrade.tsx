import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Zap, Star, Building2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 AI generations",
      "1 published website",
      "Basic templates",
      "Community support",
    ],
    icon: Zap,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious creators",
    features: [
      "Unlimited AI generations",
      "10 published websites",
      "Premium templates",
      "Priority support",
      "Custom domains",
      "Analytics dashboard",
    ],
    icon: Star,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Unlimited websites",
      "White-label branding",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    icon: Building2,
    popular: false,
  },
];

export default function UpgradePage() {
  const { token } = useAuth();

  const { data: subscription, isLoading } = useQuery<{
    planType: string;
    status: string;
    isBlocked: boolean;
    canUseAi: boolean;
  }>({
    queryKey: ["/api/subscription"],
    enabled: !!token,
  });

  const handleUpgrade = (planId: string) => {
    alert(`Stripe integration required. Plan: ${planId}\n\nTo enable payments:\n1. Set up Stripe in your Replit secrets\n2. Create products/prices in Stripe Dashboard\n3. Connect webhook endpoints`);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold" data-testid="text-upgrade-title">
          Upgrade Your Plan
        </h1>
        <p className="text-muted-foreground mt-2">
          Unlock unlimited AI generations and premium features
        </p>
      </div>

      {subscription?.isBlocked && (
        <Alert variant="destructive" className="max-w-2xl mx-auto" data-testid="alert-payment-required">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Required</AlertTitle>
          <AlertDescription>
            Your subscription has expired or payment failed. Please upgrade to continue using AI features.
          </AlertDescription>
        </Alert>
      )}

      {subscription && !subscription.canUseAi && !subscription.isBlocked && (
        <Alert className="max-w-2xl mx-auto border-primary/50" data-testid="alert-credits-exhausted">
          <Zap className="h-4 w-4" />
          <AlertTitle>Free Credits Used</AlertTitle>
          <AlertDescription>
            You've used all your free AI generations. Upgrade to Pro for unlimited access.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : (
          plans.map((plan) => {
            const isCurrentPlan = subscription?.planType === plan.id;
            const Icon = plan.icon;

            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? "border-primary" : ""}`}
                data-testid={`card-plan-${plan.id}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                      data-testid={`button-current-${plan.id}`}
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                      data-testid={`button-upgrade-${plan.id}`}
                    >
                      {plan.id === "free" ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground max-w-xl mx-auto">
        <p>
          All plans include SSL certificates, global CDN, and 99.9% uptime guarantee.
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
