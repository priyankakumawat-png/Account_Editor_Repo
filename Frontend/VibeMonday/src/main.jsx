
 
import './index.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "monday-ui-react-core/dist/main.css";
import "monday-ui-style/dist/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
  </React.StrictMode>
);