import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import "antd/dist/reset.css";
import { SearchResultsProvider } from "./context/search";
import { CartProductsProvider } from "./context/cart";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SearchResultsProvider>
      <CartProductsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProductsProvider>
    </SearchResultsProvider>
  </AuthProvider>
);
