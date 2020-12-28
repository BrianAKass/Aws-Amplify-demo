import React from "react";
import ReactDOM from "react-dom";
import Amplify from "@aws-amplify/core";
import "@aws-amplify/auth";

import awsconfig from "./aws-exports";
import App from "./App";


Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);


