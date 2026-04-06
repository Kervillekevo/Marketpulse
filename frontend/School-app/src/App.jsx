import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import ProductsList from "./pages/ProductsLists.jsx";
import Orders from "./pages/Orders.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about us" element={<About />} />
          <Route path="/contact us" element={<Contact />} />
          <Route path="reset-password/:uidb64/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;