import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "@/pages/signin"
import Signup from "@/pages/signup";
import { Dashboard } from "@/pages/dashboard";
import Credits from "@/pages/credits";
import ApiKeys from "@/pages/apikeys";
import Home from "@/pages/home";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ElysiaClientContextProvider } from "./providers/Eden";

export function App() {
  return (
    <ElysiaClientContextProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
          <Route path="/apikeys" element={<ProtectedRoute><ApiKeys /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ElysiaClientContextProvider>
  );
}

export default App;
