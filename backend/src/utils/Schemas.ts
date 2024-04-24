import * as z from "zod";

export const postSchema = z.object({
  caption: z.string({ required_error: "caption is required" }),
  province: z.string({ required_error: "province is required!" }),
  municipality: z.string({ required_error: "municipality is required!" }),
  userId: z.number().optional(),
  deletedFiles: z.array(z.string()).optional(),
  tags: z.string(),
});

export type postTypeSchema = z.infer<typeof postSchema>;

export const exploreSchema = z.object({
  title: z.string({ required_error: "title is required" }),
  description: z.string({ required_error: "description is required" }),
  province: z.string({ required_error: "province is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
});

export type exploreTypeSchema = z.infer<typeof exploreSchema>;

export const commentSchema = z.object({
  content: z.string({ required_error: "content is required" }),
});

export type commentTypeSchema = z.infer<typeof commentSchema>;

export const calendarSchema = z.object({
  title: z.string({ required_error: "title is required" }),
  details: z.string({ required_error: "details is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
  startDate: z.string({ required_error: "date is required" }),
  provinceId: z.string({ required_error: "provinceId is required" }),
  repeat: z.string({ required_error: "specify repeat" }),
  endDate: z.string().optional(),
});

export type calendarTypeSchema = z.infer<typeof calendarSchema>;

export const archiveSchema = z.object({
  title: z.string({ required_error: "title is required" }),
  description: z.string({ required_error: "description is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
  category: z.string({ required_error: "category is required" }),
  deletedFiles: z.array(z.string()).optional(),
});

export type archiveTypeSchema = z.infer<typeof archiveSchema>;

export const sharedPostSchema = z.object({
  caption: z.string({ required_error: "caption is required" }),
});

export type sharedPostTypeSchema = z.infer<typeof sharedPostSchema>;

export const heritageSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  description: z.string({ required_error: "description is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
});


export type heritageTypeSchema = z.infer<typeof heritageSchema>