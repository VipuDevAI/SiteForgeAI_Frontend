import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  Zap,
  Palette,
  BarChart3,
  Globe,
  Shield,
  ArrowRight,
  Check,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description:
      "Describe your vision and watch AI create stunning, professional websites tailored to your brand.",
  },
  {
    icon: Palette,
    title: "Premium Templates",
    description:
      "Choose from hundreds of professionally designed templates, or let AI generate a custom one.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Build and deploy websites in minutes, not days. Our AI handles the heavy lifting.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description:
      "Your sites are served from edge locations worldwide for blazing-fast load times.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SSL certificates, DDoS protection, and SOC 2 compliance included by default.",
  },
  {
    icon: BarChart3,
    title: "Built-in Analytics",
    description:
      "Track visitor behavior, conversions, and performance with our integrated analytics.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your Vision",
    description:
      "Tell our AI what kind of website you want. Be as detailed or simple as you like.",
  },
  {
    number: "02",
    title: "AI Creates Your Site",
    description:
      "Watch as our AI generates a complete, responsive website in seconds.",
  },
  {
    number: "03",
    title: "Customize & Publish",
    description:
      "Fine-tune the design, add your content, and publish with one click.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the platform",
    features: [
      "3 AI generations",
      "1 published website",
      "Basic templates",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professionals and small teams",
    features: [
      "Unlimited AI generations",
      "10 published websites",
      "Premium templates",
      "Custom domains",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For agencies and large teams",
    features: [
      "Everything in Pro",
      "Unlimited websites",
      "White-label branding",
      "API access",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">SiteForgeAI</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login" data-testid="link-login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup" data-testid="link-signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                AI-Powered Website Creation Platform
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                The Most Powerful AI
                <span className="block text-primary">Website Builder</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Describe your vision, and let our AI create a professional,
                responsive website tailored to your brand. No coding required.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup" data-testid="hero-cta-signup">
                    Start Building Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. Start building in 30 seconds.
              </p>
            </div>

            <div className="mt-16 rounded-xl border bg-card p-2 shadow-lg">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
                  <p className="text-lg font-medium">AI Website Builder Interface</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Interactive dashboard preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to Build
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features to create, customize, and deploy professional
                websites effortlessly.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From idea to live website in three simple steps.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-6xl font-bold text-primary/20">{step.number}</div>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that fits your needs. Upgrade or downgrade anytime.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={plan.popular ? "border-primary shadow-lg relative" : "relative"}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/signup">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">SiteForgeAI</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Build stunning websites in minutes with the power of AI.
              </p>
              <div className="mt-4 flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Product</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Templates</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-sm text-muted-foreground">
                2025 SiteForgeAI. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Powered by</span>
                <span className="font-semibold">SmartGenEduX</span>
                <span className="text-primary font-bold">2025</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
