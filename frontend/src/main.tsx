import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthBridge from "./features/auth/AuthBridge";
import App from "./App";
import "./index.css";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AuthBridge />
        <App />
      </ClerkProvider>
    </Provider>
  </StrictMode>
);
