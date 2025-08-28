import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, SessionStorage } from "@azure/msal-browser";
import { msalConfig } from "./Configurations/authConfig";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import RestaurantPage from "./Pages/RestaurantPage";
import PollsPage from "./Pages/PollsPage";
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import SettingsPage from "./Pages/SettingsPage";
import { WebSocketProvider } from './Context/WebSocketContext';
import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
import MakeCall2 from "./Pages/MakeCall2";
import TwilioChatPage from "./Pages/TwilioChatPage";

const msalInstance = new PublicClientApplication(msalConfig);

// Create a component to handle protected routes
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Optional: wait until context initializes
  if (user === undefined) return null; 

  if (!user) {
    return <Navigate to="/login" replace />;
   
  }

  return <WebSocketProvider>{children}</WebSocketProvider>;
};

// Component to handle catch-all routes
const CatchAllRoute = () => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        {/* Public routes */}
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route 
          index 
          element={
            <ProtectedRoute>
              <RestaurantPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="polls" 
          element={
            <ProtectedRoute>
              <PollsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />

                        <Route 
          path="MakeCall2" 
          element={
            <ProtectedRoute>
              <MakeCall2 />
            </ProtectedRoute>
          } 
        />
                        <Route 
          path="chat" 
          element={
            <ProtectedRoute>
              <TwilioChatPage />
            </ProtectedRoute>
          } 
        />

        
        
        {/* Catch all route - redirect to home for authenticated users, login for others */}
        <Route path="*" element={<CatchAllRoute />} />
      </Route>
    )
  );

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
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
        />
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;