import * as z from 'zod';
// const fileSchema = z
//   .array(
//     z.object({
//       url: z.string(),
//       filename: z.string(),
//     })
//   )
//   .refine((data) => data.length > 0, {
//     message: 'At least one file is required',
//   });
export const postSchema = z.object({
    caption: z.string({ required_error: 'caption is required' }),
    province: z.string({ required_error: 'province is required!' }),
    municipality: z.string({ required_error: 'municipality is required!' }),
    userId: z.number().optional()
});
export const exploreSchema = z.object({
    title: z.string({ required_error: 'title is required' }),
    description: z.string({ required_error: 'description is required' }),
    province: z.string({ required_error: 'province is required' }),
    municipality: z.string({ required_error: 'municipality is required' }),
});
export const commentSchema = z.object({
    content: z.string({ required_error: 'content is required' })
});
export const calendarSchema = z.object({
    title: z.string({ required_error: 'title is required' }),
    details: z.string({ required_error: 'details is required' }),
    municipality: z.string({ required_error: 'municipality is required' }),
    date: z.string({ required_error: 'date is required' }),
    provinceId: z.string({ required_error: 'provinceId is required' })
});
export const archiveSchema = z.object({
    title: z.string({ required_error: 'title is required' }),
    description: z.string({ required_error: 'description is required' }),
    municipality: z.string({ required_error: 'municipality is required' }),
    deletedFiles: z.array(z.string()).optional()
});
//# sourceMappingURL=Schemas.js.map