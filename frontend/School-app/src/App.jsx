import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

import ProductsList from "./pages/ProductsLists.jsx";
import './App.css';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter >
        <Navbar />
        <Routes>
          
          <Route path="reset-password/:uidb64/:token" element={<ResetPassword />} />
          <Route path="/" element={<ProductsList/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/products/:id" element={<ProductDetails/>}/>
        
          
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
