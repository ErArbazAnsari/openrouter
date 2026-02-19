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

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/apikeys" element={<ApiKeys />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
