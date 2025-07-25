import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./Configurations/authConfig";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import RestaurantPage from "./Pages/RestaurantPage";
import PollsPage from "./Pages/PollsPage";
import { AuthProvider } from "./Context/AuthContext";
import SettingsPage from "./Pages/SettingsPage";
import { WebSocketProvider } from './Context/WebSocketContext';
import { ToastContainer } from 'react-toastify';
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<RestaurantPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/mypolls" element={<PollsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    )
  );

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <WebSocketProvider>
          <RouterProvider router={router} />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            // transition={Bounce}
            />
        </WebSocketProvider>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;