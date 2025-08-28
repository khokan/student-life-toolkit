import './index.css'
import { router } from './routes/Routes.jsx';
import { createRoot } from "react-dom/client";
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router';


createRoot(document.getElementById("root")).render(
  <StrictMode>
          <RouterProvider router={router} />
  </StrictMode>
);
