// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatBotPage from "./pages/ChatBotPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/DashboardPage";
import Layout from "./components/Layout";
import TeamPage from "./pages/TeamPage";
import PartnersPage from "./pages/Partners";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/chatbot/conv/:id" element={<ChatBotPage />} />
          <Route path="/chatbot/conv/new" element={<ChatBotPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
