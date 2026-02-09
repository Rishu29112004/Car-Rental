import { z } from "zod";

const baseCarSchema = {
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(1, "Model is required"),

  manufacturingYear: z
    .number()
    .min(1990, "Invalid year")
    .max(new Date().getFullYear(), "Invalid year"),

  dailyPrice: z.number().min(1, "Price must be greater than 0"),

  category: z.enum(["suv", "sedan", "luxury"]),

  transmission: z.enum(["automatic", "manual"]),

  fuelType: z.enum(["petrol", "diesel", "electric"]),

  seats: z.number().min(1).max(10),

  status: z.enum(["available", "booked", "inactive"]),

  location: z.enum(["delhi", "pune", "bangalore"]),

  description: z.string().min(10, "Description is too short"),
};

export const addCarSchema = z.object({
  image: z
  .any()
  .refine((file) => file && file instanceof File, "Car image is required"),
  ...baseCarSchema,
});

export const editCarSchema = z.object({
  image: z.any().optional(),

  ...baseCarSchema,
}).partial({
  status: true, // agar edit me status optional chahiye
});

export type AddCarFormValues = z.infer<typeof addCarSchema>;
export type EditCarFormValues = z.infer<typeof editCarSchema>;
