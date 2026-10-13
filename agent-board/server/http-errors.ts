export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// Duck-typed rather than `instanceof Error` — Jest runs each test file in
// its own vm realm, where a real Node fs error's prototype chain doesn't
// match that realm's local Error constructor; checking for a string
// `message` property is realm-independent and equally correct in production.
export function errorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'unknown error';
}
