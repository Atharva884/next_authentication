import { z } from "zod";

export const schema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty("Email is required"),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(20, { message: "Password must not exceed 50 characters" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{5,}$/, {
      message: "Enter a valid password",
    })
    .nonempty("Password is required"),
});

export const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name must not exceed 50 characters" })
    .nonempty("First Name is required"),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name must not exceed 50 characters" })
    .nonempty("Last Name is required"),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must not exceed 100 characters" })
    .nonempty("Email is required"),

  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(20, { message: "Password must not exceed 50 characters" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{5,}$/, {
      message: "Enter a valid password",
    })
    .nonempty("Password is required"),
});
