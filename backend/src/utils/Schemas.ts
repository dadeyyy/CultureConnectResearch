import * as z from "zod";

export const postSchema = z.object({
<<<<<<< HEAD
  caption: z.string({ required_error: 'caption is required' }),
  province: z.string({ required_error: 'province is required!' }),
  municipality: z.string({ required_error: 'municipality is required!' }),
  userId: z.number().optional(),
  deletedFiles: z.array(z.string()).optional(),
=======
  caption: z.string({ required_error: "caption is required" }),
  province: z.string({ required_error: "province is required!" }),
  municipality: z.string({ required_error: "municipality is required!" }),
  userId: z.number().optional(),
>>>>>>> 2f040d320088046e665ff56375df521a222a0aeb
});

export type postTypeSchema = z.infer<typeof postSchema>;

<<<<<<< HEAD
export const commentSchema = z.object({
  content: z.string({ required_error: 'content is required' }),
=======
export const exploreSchema = z.object({
  title: z.string({ required_error: "title is required" }),
  description: z.string({ required_error: "description is required" }),
  province: z.string({ required_error: "province is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
});

export type exploreTypeSchema = z.infer<typeof exploreSchema>;

export const commentSchema = z.object({
  content: z.string({ required_error: "content is required" }),
>>>>>>> 2f040d320088046e665ff56375df521a222a0aeb
});

export type commentTypeSchema = z.infer<typeof commentSchema>;

export const calendarSchema = z.object({
<<<<<<< HEAD
  title: z.string({ required_error: 'title is required' }),
  details: z.string({ required_error: 'details is required' }),
  municipality: z.string({ required_error: 'municipality is required' }),
  date: z.string({ required_error: 'date is required' }),
  provinceId: z.string({ required_error: 'provinceId is required' }),
=======
  title: z.string({ required_error: "title is required" }),
  details: z.string({ required_error: "details is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
  startDate: z.string({ required_error: "date is required" }),
  provinceId: z.string({ required_error: "provinceId is required" }),
  repeat: z.string({ required_error: "specify repeat" }),
  endDate: z.string().optional(),
>>>>>>> 2f040d320088046e665ff56375df521a222a0aeb
});

export type calendarTypeSchema = z.infer<typeof calendarSchema>;

export const archiveSchema = z.object({
<<<<<<< HEAD
  title: z.string({ required_error: 'title is required' }),
  description: z.string({ required_error: 'description is required' }),
  municipality: z.string({ required_error: 'municipality is required' }),
=======
  title: z.string({ required_error: "title is required" }),
  description: z.string({ required_error: "description is required" }),
  municipality: z.string({ required_error: "municipality is required" }),
  category: z.string({ required_error: "category is required" }),
>>>>>>> 2f040d320088046e665ff56375df521a222a0aeb
  deletedFiles: z.array(z.string()).optional(),
});

export type archiveTypeSchema = z.infer<typeof archiveSchema>;
