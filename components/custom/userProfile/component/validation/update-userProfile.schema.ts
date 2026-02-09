import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  bio: z.string().min(5, "Bio is required"),
});


export const updateUserPicture = profileUpdateSchema.extend({
  image: z
  .any()
  .refine(
    (file) => !file || file instanceof File,
    "Invalid file"
  )
  .optional()
});


export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
export type UpdateUserPictureSchema = z.infer<typeof updateUserPicture>;
