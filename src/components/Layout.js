import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  const location = useLocation();

  const hideLayoutForPaths = ["/chatbot"];

  const isChatbotPage = hideLayoutForPaths.some((path) =>
    location.pathname.startsWith(path)
  );

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
