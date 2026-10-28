import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#161310] text-[#e9e1dc] flex flex-col font-sans selection:bg-[#ef8148] selection:text-[#161310]">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#221f1c",
            color: "#e9e1dc",
            border: "1px solid #38332e",
            fontSize: "13px",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#82d8a6",
              secondary: "#161310",
            },
          },
          error: {
            iconTheme: {
              primary: "#ffb4ab",
              secondary: "#161310",
            },
          },
        }}
      />
      <Navbar />
      <main className="w-full pt-[64px] flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
