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
export const commentSchema = z.object({
    content: z.string({ required_error: 'content is required' })
});
export const calendarSchema = z.object({
    title: z.string({ required_error: 'title is required' }),
    details: z.string({ required_error: 'details is required' }),
    startDate: z.date({ required_error: 'startDate is required' }),
    endDate: z.date({ required_error: 'endDate is required' }),
    provinceId: z.string({ required_error: 'provinceId is required' })
});
//# sourceMappingURL=Schemas.js.map