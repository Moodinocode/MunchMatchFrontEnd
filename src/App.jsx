import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./Configurations/authConfig";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import RestaurantPage from "./Pages/RestaurantPage";
import PollsPage from "./Pages/PollsPage";
import { AuthProvider } from "./Context/AuthContext";
import { MultiWebSocketProvider } from "./Context/MultiWebSocketContext";
import SettingsPage from "./Pages/SettingsPage";
//import WebSocketDemo from "./Pages/websocket";

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
        {/* <Route path="/web" element={<WebSocketDemo />} /> */}
      </Route>
    )
  );

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <MultiWebSocketProvider>
          <RouterProvider router={router} />
        </MultiWebSocketProvider>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;