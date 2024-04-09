import App from "@src/App";
import { ThemeProvider } from "@src/contexts/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <App></App>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
