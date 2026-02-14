import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/app/store.ts";
import { Login } from "./pages/Auth/Login.tsx";
import { Register } from "./pages/Auth/Register.tsx";
import { PrivateRoute } from "./components/PrivateRoute.tsx";
import { Profile } from "./pages/User/Profile.tsx";
import { AdminRoute } from "./pages/Admin/AdminRoute.tsx";
import { UserList } from "./pages/Admin/UserList.tsx";
import { CategoryList } from "./pages/Admin/CategoryList.tsx";
import { ProductList } from "./pages/Admin/ProductList.tsx";
import { AllProducts } from "./pages/Admin/AllProducts.tsx";
import { AdminProductUpdate } from "./pages/Admin/ProductUpdate.tsx";
import { Home } from "./pages/Home.tsx";
import { Favorites } from "./pages/products/Favorites.tsx";
import { ProductDetails } from "./pages/products/ProductDetails.tsx";
import { Cart } from "./pages/Cart.tsx";
import { Shop } from "./pages/Shop.tsx";
import { Shipping } from "./pages/orders/Shipping.tsx";
import { PlaceOrder } from "./pages/orders/PlaceOrder.tsx";
import { Order } from "./components/Order.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { UserOrder } from "./pages/User/UserOrder.tsx";
import { OrderList } from "./pages/Admin/OrderList.tsx";
import { AdminDashboard } from "./pages/Admin/AdminDashboard.tsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { APP_NAME } from "./config/constants.ts";
import { NotFound } from "./components/NotFound.tsx";

const elementRoute = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="" index element={<Home />} />
    <Route path="favorite" index element={<Favorites />} />
    <Route path="product/:id" index element={<ProductDetails />} />
    <Route path="cart" index element={<Cart />} />
    <Route path="shop" index element={<Shop />} />
    <Route path="user-orders" index element={<UserOrder />} />

    {/* Register users */}
    <Route path="" element={<PrivateRoute />}>
      <Route path="profile" element={<Profile />} />
      <Route path="shipping" element={<Shipping />} />
      <Route path="place-order" element={<PlaceOrder />} />
      <Route path="order/:id" element={<Order />} />
    </Route>

    {/* Admin users */}
    <Route path="/admin" element={<AdminRoute />}>
      <Route path="user-list" element={<UserList />} />
      <Route path="category-list" element={<CategoryList />} />
      <Route path="product-list" element={<ProductList />} />
      <Route path="all-products-list" element={<AllProducts />} />
      <Route path="product/update/:_id" element={<AdminProductUpdate />} />
      <Route path="order-list" element={<OrderList />} />
      <Route path="dashboard" element={<AdminDashboard />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Route>,
);
const route = createBrowserRouter(elementRoute);

const PAYPAL_CLIENT_ID =
  "ATyJuPFJFwShReQ7hPWmUlI_3hzO6QErjyAS6uZau661YkDElWTieSPS3bObdPxd-XJnB3DJK2p6YOFW";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture",
        }}
      >
        <title>{APP_NAME}</title>
        <RouterProvider router={route} />
      </PayPalScriptProvider>
    </Elements>
  </Provider>,
);
