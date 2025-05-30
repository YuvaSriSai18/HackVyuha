import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConnectWallet from "./pages/ConnectWallet";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectWallet />} />
      </Routes>
    </BrowserRouter>
  );
}
