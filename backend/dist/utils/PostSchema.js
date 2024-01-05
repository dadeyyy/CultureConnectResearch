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
//# sourceMappingURL=PostSchema.js.map