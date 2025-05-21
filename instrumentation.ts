import * as Sentry from "@sentry/nextjs";
import { captureRequestError } from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [],
  });
}

export function onRequestError(
  error: unknown,
  request: Request | string,
  errorContext: {
    componentStack?: string;
    errorSource?: string;
  }
) {
    captureRequestError(error, request as unknown as RequestInfo, errorContext);
      
}
