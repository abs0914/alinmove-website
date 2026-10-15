import { z } from "zod";
import {
  TRACKING_NUMBER_MAX_LENGTH,
  TRACKING_NUMBER_MIN_LENGTH,
  TRACKING_NUMBER_PATTERN,
} from "./format";

export const trackingNumberSchema = z
  .string()
  .trim()
  .min(TRACKING_NUMBER_MIN_LENGTH)
  .max(TRACKING_NUMBER_MAX_LENGTH)
  .regex(TRACKING_NUMBER_PATTERN, "Unsupported tracking-number characters");

export function validateTrackingNumber(value: unknown) {
  return trackingNumberSchema.safeParse(value);
}
