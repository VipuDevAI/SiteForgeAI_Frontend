import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Wand2, Building2, Palette } from "lucide-react";

const websiteFormSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Select a business type"),
  description: z.string().min(10, "Provide at least 10 characters describing your business"),
  primaryColor: z.string().optional(),
});

type WebsiteFormData = z.infer<typeof websiteFormSchema>;

const businessTypes = [
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "ecommerce", label: "E-commerce / Online Store" },
  { value: "consulting", label: "Consulting / Professional Services" },
  { value: "healthcare", label: "Healthcare / Medical" },
  { value: "realestate", label: "Real Estate" },
  { value: "education", label: "Education / Training" },
  { value: "technology", label: "Technology / SaaS" },
  { value: "fitness", label: "Fitness / Wellness" },
  { value: "creative", label: "Creative Agency / Design" },
  { value: "nonprofit", label: "Non-Profit / NGO" },
  { value: "legal", label: "Legal Services" },
  { value: "finance", label: "Finance / Accounting" },
  { value: "travel", label: "Travel / Tourism" },
  { value: "automotive", label: "Automotive" },
  { value: "other", label: "Other" },
];

const colorPresets = [
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-emerald-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-violet-500" },
  { value: "#F59E0B", label: "Orange", class: "bg-amber-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#EC4899", label: "Pink", class: "bg-pink-500" },
  { value: "#14B8A6", label: "Teal", class: "bg-teal-500" },
  { value: "#6366F1", label: "Indigo", class: "bg-indigo-500" },
];

export default function WebsiteBuilder() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const form = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      description: "",
      primaryColor: "#3B82F6",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: WebsiteFormData) => {
      const response = await apiRequest("POST", "/api/website/generate", {
        ...data,
        primaryColor: selectedColor,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Website Generated!",
        description: "Your stunning website has been created.",
      });
      setLocation(`/dashboard/editor/${data.project.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: WebsiteFormData) {
    generateMutation.mutate(data);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wand2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
        </div>
        <p className="text-muted-foreground">
          Describe your business and let AI create a stunning, professional website for you in seconds.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Your Website
          </CardTitle>
          <CardDescription>
            Fill in the details below and our AI will generate a complete, responsive website tailored to your brand.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Business Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Acme Corporation"
                        data-testid="input-business-name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will appear in your website header and branding
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-business-type">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps AI understand your industry and create relevant sections
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, services, and what makes you unique. The more detail you provide, the better the AI can tailor your website..."
                        className="min-h-[120px]"
                        data-testid="textarea-description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include your services, target audience, and unique selling points
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Brand Color
                </FormLabel>
                <div className="flex flex-wrap gap-3">
                  {colorPresets.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-lg transition-all ${color.class} ${
                        selectedColor === color.value
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : "hover:scale-105"
                      }`}
                      title={color.label}
                      data-testid={`color-${color.label.toLowerCase()}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {colorPresets.find((c) => c.value === selectedColor)?.label || "Custom"}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={generateMutation.isPending}
                  data-testid="button-generate"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Website...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate My Website
                    </>
                  )}
                </Button>
                {generateMutation.isPending && (
                  <p className="text-sm text-muted-foreground text-center mt-3">
                    This may take 30-60 seconds. AI is crafting your perfect website...
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
