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

import { useState, useEffect, createContext } from 'react'
import useWebSocket, { ReadyState } from "react-use-websocket";
import { json } from "@remix-run/node";



export function links() {
  return [
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

export const WebSocketContext = createContext(null);

export default function App() {
  const data = useLoaderData();

  // ESTABLISH WEBSOCKETS
  const [socketUrl, setSocketUrl] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(data.ENV.WEBSOCKETS_URL);

  useEffect(()=>{
    if(typeof window!== 'undefined'){
        setSocketUrl(window.ENV.WEBSOCKETS_URL)
    }
  }, [])

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <WebSocketContext.Provider value={{
          connectionStatus: connectionStatus,
          messageHistory: messageHistory,
          lastMessage: lastMessage
        }}>
          <Outlet />
        </WebSocketContext.Provider>
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
