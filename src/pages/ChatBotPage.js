import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Paper,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Drawer,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import chatbotMascot from "../assets/mascotteSunuchat.png";
import { useNavigate, useParams } from "react-router-dom";
import SidebarConversations from "../components/SidebarConversations";

function ChatBotPage() {
  const [chat, setChat] = useState([]);
  const [recording, setRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { id: conversationId } = useParams();
  const token = localStorage.getItem("token");
  const isConnected = !!token;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (window.innerWidth >= 900) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      const fetchConversation = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${process.env.REACT_APP_BACK_URL}/conversations/${conversationId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const msgs = res.data.messages.map((m) => ({
            sender: m.sender,
            message_type: m.message_type,
            content: m.content,
            audio_path: m.audio_path,
            timestamp: m.timestamp,
          }));
          setChat(msgs);
        } catch (err) {
          console.error("Erreur chargement conv :", err);
        }
      };
      fetchConversation();
    } else {
      setChat([]);
    }
  }, [conversationId]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/conversations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Erreur récupération conversations :", err);
      }
    };
    fetchConversations();
  }, [conversationId]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    streamRef.current = stream;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    mediaRecorder.onstop = handleSendAudio;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current.onstop = null;
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const handleSendAudio = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const localAudioUrl = URL.createObjectURL(audioBlob);

    const localAudioMessage = {
      sender: "user",
      message_type: "audio",
      content: "Audio envoyé",
      audio_path: localAudioUrl,
      timestamp: new Date().toISOString(),
    };
    setChat((prev) => [...prev, localAudioMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const uploadRes = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/upload_audio`,
        formData
      );
      const userAudioUrl = uploadRes.data.audio_url;

      const storedAudioMessage = {
        sender: "user",
        message_type: "audio",
        content: "Audio envoyé",
        audio_path: userAudioUrl,
        timestamp: new Date().toISOString(),
      };

      if (isConnected && !conversationId) {
        const res = await axios.post(
          `${process.env.REACT_APP_BACK_URL}/conversations/first-message`,
          storedAudioMessage,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newConvId = res.data.conversation_id;

        const botRes = await axios.post(
          `${process.env.REACT_APP_BACK_URL}/chatbot`,
          formData
        );
        const botAudioUrl = botRes.data.audio_url;

        const botAudioMessage = {
          sender: "bot",
          message_type: "audio",
          content: botRes.data.text,
          audio_path: botAudioUrl,
          timestamp: new Date().toISOString(),
        };

        setChat((prev) => [...prev, botAudioMessage]);

        await axios.post(
          `${process.env.REACT_APP_BACK_URL}/conversations/${newConvId}/message`,
          botAudioMessage,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        navigate(`/chatbot/conv/${newConvId}`);
      } else if (isConnected && conversationId) {
        await axios.post(
          `${process.env.REACT_APP_BACK_URL}/conversations/${conversationId}/message`,
          storedAudioMessage,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const botRes = await axios.post(
          `${process.env.REACT_APP_BACK_URL}/chatbot`,
          formData
        );
        const botAudioUrl = botRes.data.audio_url;

        const botAudioMessage = {
          sender: "bot",
          message_type: "audio",
          content: botRes.data.text,
          audio_path: botAudioUrl,
          timestamp: new Date().toISOString(),
        };

        setChat((prev) => [...prev, botAudioMessage]);

        await axios.post(
          `${process.env.REACT_APP_BACK_URL}/conversations/${conversationId}/message`,
          botAudioMessage,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Si non connecté, juste chatbot
      else {
        const botRes = await axios.post(
          `${process.env.REACT_APP_BACK_URL}/chatbot`,
          formData
        );
        const botAudioUrl = botRes.data.audio_url;

        const botAudioMessage = {
          sender: "bot",
          message_type: "audio",
          content: botRes.data.text,
          audio_path: botAudioUrl,
          timestamp: new Date().toISOString(),
        };

        setChat((prev) => [...prev, botAudioMessage]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = async () => {
    if (!userInput.trim()) return;

    const newMessage = {
      sender: "user",
      message_type: "text",
      content: userInput.trim(),
      audio_path: null,
      timestamp: new Date().toISOString(),
    };

    setChat((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/chatbotext`,
        { text: newMessage.content }
      );

      const botMessage = {
        sender: "bot",
        message_type: "text",
        content: response.data.reponse,
        audio_path: null,
        timestamp: new Date().toISOString(),
      };

      setChat((prev) => [...prev, botMessage]);

      if (isConnected) {
        if (!conversationId) {
          const res = await axios.post(
            `${process.env.REACT_APP_BACK_URL}/conversations/first-message`,
            newMessage,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await axios.post(
            `${process.env.REACT_APP_BACK_URL}/conversations/${res.data.conversation_id}/message`,
            botMessage,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          navigate(`/chatbot/conv/${res.data.conversation_id}`);
        } else {
          await axios.post(
            `${process.env.REACT_APP_BACK_URL}/conversations/${conversationId}/message`,
            newMessage,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await axios.post(
            `${process.env.REACT_APP_BACK_URL}/conversations/${conversationId}/message`,
            botMessage,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (entry, index) => (
    <CSSTransition key={index} timeout={300} classNames="fade">
      <Box
        sx={{
          display: "flex",
          flexDirection: entry.sender === "user" ? "row-reverse" : "row",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <Avatar src={entry.sender === "user" ? undefined : chatbotMascot} />
        <Paper
          sx={{
            p: 2,
            borderRadius: "18px",
            backgroundColor: entry.sender === "user" ? "#cfe8ff" : "#defade",
            maxWidth: "75%",
          }}
        >
          <Tooltip
            title={new Date(entry.timestamp).toLocaleTimeString()}
            arrow
            placement={entry.sender === "user" ? "left" : "right"}
          >
            <Box>
              {entry.message_type === "text" ? (
                <Typography fontSize="16px" lineHeight={1.6}>
                  {entry.content}
                </Typography>
              ) : (
                <Box sx={{ width: "200px" }}>
                  <audio
                    controls
                    src={entry.audio_path}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
          </Tooltip>
        </Paper>
      </Box>
    </CSSTransition>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        minHeight: 0,
        backgroundColor: "#f0f2f5",
      }}
    >
      {isConnected && sidebarOpen && (
        <SidebarConversations
          conversations={conversations}
          selectedId={conversationId}
          setConversations={setConversations}
        />
      )}

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <SidebarConversations
          conversations={conversations}
          selectedId={conversationId}
        />
      </Drawer>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",

          margin: "0 auto",
          backgroundColor: "#ffffff",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
            color: "#fff",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isConnected && (
              <IconButton
                sx={{ color: "#fff" }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Avatar src={chatbotMascot} sx={{ width: 48, height: 48 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                SunuChat
              </Typography>
              <Typography variant="body2">
                Assistant vocal intelligent multilingue 🌍
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            {token ? "Déconnexion" : "Se connecter"}
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            p: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <TransitionGroup>{chat.map(renderMessage)}</TransitionGroup>
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{ p: 2, borderTop: "1px solid #e0e0e0", backgroundColor: "#fff" }}
        >
          <TextField
            fullWidth
            placeholder="Écrivez un message..."
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            disabled={isLoading || recording}
            sx={{ bgcolor: "white", borderRadius: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ gap: 1 }}>
                  <Tooltip title={recording ? "Arrêter" : "Parler"}>
                    <IconButton
                      onClick={recording ? stopRecording : startRecording}
                      disabled={isLoading}
                      sx={{
                        animation: recording ? "pulse 2s infinite" : "none",
                      }}
                    >
                      {recording ? (
                        <StopIcon color="error" />
                      ) : (
                        <MicIcon color="primary" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Envoyer">
                    <IconButton
                      onClick={handleSendText}
                      disabled={isLoading || !userInput.trim() || recording}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SendIcon color="primary" />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          {recording && (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography color="error" fontWeight={600}>
                🎙️ Enregistrement en cours...
              </Typography>
              <Button
                onClick={cancelRecording}
                startIcon={<CloseIcon />}
                color="error"
                size="small"
              >
                Annuler
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ChatBotPage;
