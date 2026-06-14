import { BrowserRouter, Route, Routes } from "react-router";
import { HomeRoute } from "./routes/home/route";
import { CartRoute } from "./routes/cart/route";
import { SettingsRoute } from "./routes/settings/route";
import { ProductPriceProvider } from "./providers/ProductPrice";
import { CartProvider } from "./providers/Cart";

export const App = () => {
  return (
    <BrowserRouter>
      <ProductPriceProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/cart" element={<CartRoute />} />
            <Route path="/settings" element={<SettingsRoute />} />
          </Routes>
        </CartProvider>
      </ProductPriceProvider>
    </BrowserRouter>
  );
};
