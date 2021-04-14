import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://2d2779a3fc404fbe8aa8595186b56016@o509416.ingest.sentry.io/5603849",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  sampleRate: 1.0,
});
