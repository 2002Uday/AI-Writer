import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // You'll need to create this
import Home from "./pages/Home"; // You'll need to create this
import BrainstormingSession from "./pages/BrainstormingSession";
import { ProtectedRoute, AuthRoute } from "./middleware/auth";
import Login from "./pages/Login"; // You'll need to create this
import Register from "./pages/Register"; // You'll need to create this
import Dashboard from "./pages/Dashboard"; // You'll need to create this
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        {/* Auth routes (accessible only when not logged in) */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

         {/* Protected routes (accessible only when logged in) */}
         <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brainstorm" element={<BrainstormingSession />} />
          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
