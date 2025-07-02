import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MerchantDashboard from "./pages/MerchantDashboard";
import EventCreatePage from "./pages/EventCreatePage";
import EventListPage from "./pages/EventListPage";
import EventDetailPage from "./pages/EventDetailPage";
import BuyerHomePage from "./pages/BuyerHomePage";
import CheckoutPage from "./pages/CheckoutPage";
import EditEventPage from "./pages/EditEventPage";

function App() {
  return (
    <Router>
      {/* 顶部导航，所有路由共享 */}
      <NavBar />

      {/* 然后是我们的路由内容 */}
      <Routes>
        <Route path="/" element={<BuyerHomePage />} />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/merchant/edit-event/:eventId" element={<EditEventPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="/merchant/create-event" element={<EventCreatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
