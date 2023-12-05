import * as z from "zod";

export const registration = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  userName: z.string().min(2),
  birthdate: z.coerce.date(),
  email: z.string().email(),
  password: z.string().min(8, { message: "Must be a minimum of 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Must be a minimum of 8 characters." }),
});

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Must be a minimum of 8 characters." }),
});
