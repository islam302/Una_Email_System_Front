import "./style.css";
import React from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </HelmetProvider>
    </I18nextProvider>
  </React.StrictMode>
);
