/**
 * webpack-dev-server entry point for debugging.
 * This file is not bundled with the library during the build process.
 */

 import App from "./App";
 import React from "react";
 
 import { PrifinaProvider, PrifinaContext } from "@prifina/hooks-v2";
 import { createRoot } from 'react-dom/client';

 const LocalComponent = (props) => {
 
  return (
    <PrifinaProvider activeApp={"WIDGET"} stage={"dev"} Context={PrifinaContext}>
      <App {...props} />
     </PrifinaProvider>
    
  );
};
 
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<LocalComponent />);


