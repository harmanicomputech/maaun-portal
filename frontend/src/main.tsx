import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  setAuthTokenGetter,
  setBaseUrl,
} from "@workspace/api-client-react";

const apiUrl = import.meta.env.VITE_API_URL ?? "";
setBaseUrl(apiUrl);
setAuthTokenGetter(() => localStorage.getItem("maaun_token"));

createRoot(document.getElementById("root")!).render(<App />);
