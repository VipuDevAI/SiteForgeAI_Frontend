import { z } from "zod";

// Role and status enums as type definitions
export type Role = "ADMIN" | "CLIENT";
export type ProjectStatus = "draft" | "published" | "archived";
export type SubscriptionStatus = "free" | "active" | "past_due" | "cancelled";
export type PlanType = "free" | "pro" | "enterprise";

// User types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  planType: PlanType;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionEndDate: Date | null;
  createdAt: Date;
}

export type UserSafe = Omit<User, "password">;

// Project types
export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  templateId: string | null;
  status: ProjectStatus;
  domain: string | null;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Template types
export interface Template {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  isPremium: boolean;
  createdAt: Date;
}

// Media types
export interface Media {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  userId: string;
  createdAt: Date;
}

// AI Generation types
export interface AiGeneration {
  id: string;
  userId: string;
  prompt: string;
  result: string | null;
  tokensUsed: number | null;
  createdAt: Date;
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const insertProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  templateId: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  domain: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const insertTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isPremium: z.boolean().default(false),
});

export const insertMediaSchema = z.object({
  name: z.string().min(1, "Media name is required"),
  url: z.string().url("Invalid URL"),
  type: z.string().min(1, "Type is required"),
  size: z.number().positive("Size must be positive"),
});

export const aiGenerateSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  type: z.enum(["content", "design", "seo"]).default("content"),
});

// Insert types
export type InsertUser = z.infer<typeof signupSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type InsertAiGeneration = { prompt: string };
