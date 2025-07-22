import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatBotPage from "./pages/ChatBotPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot/conv/:id" element={<ChatBotPage />} />
        <Route path="/chatbot/conv/new" element={<ChatBotPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
