import { Rating } from "ts-fsrs";
import { z } from "zod";

export const reviewCardSchema = z.object({
  rating: z.number().min(Rating.Again).max(Rating.Easy),
});
