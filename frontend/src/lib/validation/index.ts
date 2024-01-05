import * as z from "zod";

export const registration = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    userName: z.string().min(2),
    birthdate: z.string(),
    email: z.string().email(),
    password: z.string().min(8, { message: "Must be a minimum of 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Must be a minimum of 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const login = z.object({
<<<<<<< HEAD
  username: z.string(),
=======
  username: z.string().min(2),
>>>>>>> 0b6a8bd2bd005b549a3f2ea5db3bc1226e86c609
  password: z.string().min(8, { message: "Must be a minimum of 8 characters." }),
});
