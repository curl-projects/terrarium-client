import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { hydrate } from 'react-dom'

function hydrate_func() {
  startTransition(() => {
    hydrate(
      <StrictMode>
          <RemixBrowser />
      </StrictMode>,
      document
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate_func);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate_func, 1);
}
