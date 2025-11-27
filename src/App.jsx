import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Faq from "./components/Faq";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/faqs"
              element={
                <ProtectedRoute>
                  <Faq />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
