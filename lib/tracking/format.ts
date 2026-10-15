export const TRACKING_NUMBER_MIN_LENGTH = 6;
export const TRACKING_NUMBER_MAX_LENGTH = 64;
export const TRACKING_NUMBER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function hasValidTrackingNumberFormat(value: string) {
  const trimmed = value.trim();
  return (
    trimmed.length >= TRACKING_NUMBER_MIN_LENGTH &&
    trimmed.length <= TRACKING_NUMBER_MAX_LENGTH &&
    TRACKING_NUMBER_PATTERN.test(trimmed)
  );
}

