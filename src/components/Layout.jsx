import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideLayoutForPaths = [
    "/chatbot",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  const isChatbotPage = hideLayoutForPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // en secondes

      if (decoded.exp < now) {
        console.warn("Token expiré");
        localStorage.removeItem("token");

      
      }
    } catch (error) {
      console.warn("Token invalide");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  if (isChatbotPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
