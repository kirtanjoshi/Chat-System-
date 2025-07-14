import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginPage from './auth/LoginPage.jsx'
import SignUpPage from './auth/SignUp.jsx'
import { BrowserRouter} from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    
      <App />
    </BrowserRouter>
    
  </StrictMode>
);
