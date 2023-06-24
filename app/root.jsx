import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

import styles from "~/styles/app.css";
import globalStyles from "~/styles/global.css"
import draftStyles from "draft-js/dist/Draft.css"
import agGrid from 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import agGridAlpine from 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import { json } from "@remix-run/node";



export function links() {
  return [
    {rel: 'icon', 'href': '/favicon.svg', type: "image/svg"},
    {rel: "stylesheet", href: styles},
    {rel: 'stylesheet', href: globalStyles},
    {rel: 'stylesheet', href: draftStyles},
    {rel: 'stylesheet', href: agGrid},
    {rel: 'stylesheet', href: agGridAlpine},
];
}

export const meta = () => ({
  charset: "utf-8",
  title: "Terrarium",
  viewport: "width=device-width,initial-scale=1",
});

export function loader(){
  return json({
    ENV: {
      WEBSOCKETS_URL: process.env.WEBSOCKETS_URL
    }
  })
}

export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              data.ENV
            )}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
