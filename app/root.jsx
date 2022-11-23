import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "~/styles/app.css";
import globalStyles from "~/styles/global.css"
import draftStyles from "draft-js/dist/Draft.css"


export function links() {
  return [
    {rel: "stylesheet", href: styles},
    {rel: 'stylesheet', href: globalStyles},
    {rel: 'stylesheet', href: draftStyles},
];
}

export const meta = () => ({
  charset: "utf-8",
  title: "Terrarium",
  viewport: "width=device-width,initial-scale=1",
});


export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
