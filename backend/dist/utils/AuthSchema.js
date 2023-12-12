import * as z from 'zod';
export const signInSchema = z.object({
    username: z.string({ required_error: 'Username is required' }),
    password: z.string({ required_error: 'Password is required' }),
});
export const signUpSchema = z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z
        .string({ required_error: 'password is required' })
        .min(5, { message: 'Password must be atleast 5 characters' }),
    firstName: z.string({ required_error: 'First Name is required' }),
    lastName: z.string({ required_error: 'Last Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
});
//# sourceMappingURL=AuthSchema.js.map