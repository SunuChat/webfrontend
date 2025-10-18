import { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Paper,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  Tooltip,
  Drawer,
  Switch,
  FormControlLabel,
  styled,
  Stack,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Alert,
  Fab,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BeenhereRoundedIcon from "@mui/icons-material/BeenhereRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import chatbotMascot from "../assets/mascotteSunuchat.png";
import { useNavigate, useParams } from "react-router-dom";
import SidebarConversations from "../components/SidebarConversations";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

const CHAR_LIMIT = 1800;
const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];

function ChatBotPage() {
  const [chat, setChat] = useState([]);
  const [recording, setRecording] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(!navigator.onLine);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 0..100 or null
  const [lastRate, setLastRate] = useState(() =>
    Number(localStorage.getItem("sunuchat_rate") || 1)
  );

  // --- Typing state (robuste) ---
  const [typing, setTyping] = useState(false);
  const pendingBotRef = useRef(0);
  const typingDelayRef = useRef(null);

  const isSmall = useMediaQuery("(max-width:600px)");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const listRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { id: conversationId } = useParams();
  const token = localStorage.getItem("token");
  const isConnected = !!token;
  const [ephemere, setEphemere] = useState(false);

  const quickPrompts = useMemo(
    () => [
      "Quels sont les symptômes de la dengue ?",
      "En wolof, comment prévenir le paludisme ?",
      "La fièvre de mon enfant dure depuis 3 jours, que faire ?",
      "Donne-moi les signes d’alerte qui nécessitent d’aller au poste de santé",
    ],
    []
  );

  // Scroll helpers
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
      setShowScrollDown(!nearBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [chat, typing]);

  useEffect(() => {
    if (window.innerWidth >= 900) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Charger conversation courante
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
          setError("Impossible de charger la conversation.");
        }
      };
      fetchConversation();
    } else {
      setChat([]);
    }
  }, [conversationId]);

  // Charger la liste des conversations
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

  /* ================= Recording ================= */
  const [recMs, setRecMs] = useState(0);
  const [vuLevel, setVuLevel] = useState(0); // 0..1
  const rafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const srcNodeRef = useRef(null);
  const recTimerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      audioChunksRef.current = [];

      // WebAudio for VU meter
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      srcNodeRef.current = source;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteTimeDomainData(dataArray);
        let peak = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128; // -1..1
          peak = Math.max(peak, Math.abs(v));
        }
        setVuLevel(peak);
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = handleSendAudio;
      mediaRecorder.start();
      setRecording(true);
      setRecMs(0);
      recTimerRef.current = setInterval(() => setRecMs((t) => t + 100), 100);
    } catch (e) {
      setError("Micro non accessible. Vérifiez les permissions.");
    }
  };

  const cleanupAudioGraph = () => {
    cancelAnimationFrame(rafRef.current);
    try {
      srcNodeRef.current && srcNodeRef.current.disconnect();
    } catch {}
    try {
      analyserRef.current && analyserRef.current.disconnect();
    } catch {}
    try {
      audioCtxRef.current && audioCtxRef.current.close();
    } catch {}
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRecording(false);
    clearInterval(recTimerRef.current);
    cleanupAudioGraph();
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.onstop = null;
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRecording(false);
    clearInterval(recTimerRef.current);
    cleanupAudioGraph();
  };

  /* ================= Typing helper ================= */
  const beginBotWait = () => {
    pendingBotRef.current += 1;
    if (typingDelayRef.current) clearTimeout(typingDelayRef.current);
    // petit délai pour éviter les clignotements si la réponse est ultra rapide
    typingDelayRef.current = setTimeout(() => {
      if (pendingBotRef.current > 0) setTyping(true);
    }, 250);
  };

  const endBotWait = () => {
    pendingBotRef.current = Math.max(0, pendingBotRef.current - 1);
    if (pendingBotRef.current === 0) {
      if (typingDelayRef.current) clearTimeout(typingDelayRef.current);
      setTyping(false);
    }
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
    setUploadProgress(5);
    beginBotWait();

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const uploadRes = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/upload_audio`,
        formData,
        {
          onUploadProgress: (e) => {
            if (!e.total) return;
            const p = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(Math.max(5, p));
          },
        }
      );
      const userAudioUrl = uploadRes.data.audio_url;

      const storedAudioMessage = {
        sender: "user",
        message_type: "audio",
        content: "Audio envoyé",
        audio_path: userAudioUrl,
        timestamp: new Date().toISOString(),
      };

      // Persist & fetch bot
      if (isConnected && !conversationId && !ephemere) {
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
      } else if (isConnected && conversationId && !ephemere) {
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
      } else {
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
      setError("Échec de l’envoi de l’audio.");
    } finally {
      endBotWait();
      setTimeout(() => setUploadProgress(null), 400);
    }
  };

  /* ================= Text ================= */
  const handleSendText = async (forcedText) => {
    const text = typeof forcedText === "string" ? forcedText : userInput.trim();
    if (!text) return;

    const newMessage = {
      sender: "user",
      message_type: "text",
      content: text,
      audio_path: null,
      timestamp: new Date().toISOString(),
    };
    setChat((prev) => [...prev, newMessage]);
    setUserInput("");
    beginBotWait();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/chatbotext`,
        { text }
      );
      const botMessage = {
        sender: "bot",
        message_type: "text",
        content: response.data.reponse,
        audio_path: null,
        timestamp: new Date().toISOString(),
      };
      setChat((prev) => [...prev, botMessage]);

      if (isConnected && !ephemere) {
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
      setError("Message non envoyé. Réessayez.");
    } finally {
      endBotWait();
    }
  };

  /* ================= Render ================= */
  const renderMessage = (entry, index, prev) => {
    const currentDay = new Date(entry.timestamp).toDateString();
    const prevDay = prev ? new Date(prev.timestamp).toDateString() : null;
    const showDayDivider = currentDay !== prevDay;

    return (
      <CSSTransition key={index} timeout={240} classNames="fade">
        <Box>
          {showDayDivider && <DayDivider date={new Date(entry.timestamp)} />}
          <MessageRow owner={entry.sender === "user" ? "user" : "bot"}>
            {entry.sender !== "user" && (
              <Avatar
                src={chatbotMascot}
                alt="SunuChat Bot"
                sx={{ width: 40, height: 40 }}
              />
            )}
            <MessageBubble
              owner={entry.sender === "user" ? "user" : "bot"}
              copyable={
                entry.sender !== "user" && entry.message_type === "text"
              }
              copyText={
                entry.sender !== "user" && entry.message_type === "text"
                  ? String(entry.content ?? "")
                  : ""
              }
            >
              <Tooltip
                title={new Date(entry.timestamp).toLocaleString()}
                arrow
                placement={entry.sender === "user" ? "left" : "right"}
              >
                <Box>
                  {entry.message_type === "text" ? (
                    <Typography
                      color="#fff"
                      fontWeight={600}
                      fontSize="16px"
                      lineHeight={1.6}
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {entry.content}
                    </Typography>
                  ) : (
                    <AudioMessage
                      url={entry.audio_path}
                      color={
                        entry.sender === "user"
                          ? PRIMARY_COLOR
                          : SECONDARY_COLOR
                      }
                      lastRate={lastRate}
                      onRate={(r) => {
                        setLastRate(r);
                        localStorage.setItem("sunuchat_rate", String(r));
                      }}
                      caption={
                        entry.sender !== "user" ? entry.content : undefined
                      }
                    />
                  )}
                </Box>
              </Tooltip>
            </MessageBubble>
            {entry.sender === "user" && (
              <Avatar sx={{ width: 40, height: 40 }} />
            )}
          </MessageRow>
        </Box>
      </CSSTransition>
    );
  };

  const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 60,
    height: 30,
    padding: 0,
    display: "flex",
    "& .MuiSwitch-switchBase": {
      padding: 2,
      color: "#fff",
      "&.Mui-checked": {
        transform: "translateX(30px)",
        color: "#fff",
        "& + .MuiSwitch-track": { backgroundColor: "#000", opacity: 1 },
      },
    },
    "& .MuiSwitch-thumb": { width: 26, height: 26, boxShadow: "none" },
    "& .MuiSwitch-track": {
      borderRadius: 15,
      backgroundColor: "#000",
      opacity: 0.5,
    },
  }));

  // ne montrer la typing bubble que si:
  // - une réponse bot est réellement en attente
  // - et le dernier message affiché vient de l'utilisateur
  const shouldShowTyping =
    typing && (chat.length === 0 || chat[chat.length - 1]?.sender === "user");

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        minHeight: 0,
        backgroundColor: "#f5f7fb",
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
          backgroundColor: "#ffffff",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            px: 3,
            borderBottom: `1px solid rgba(255,255,255,0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: `linear-gradient(90deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
            color: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            position: "sticky",
            top: 0,
            zIndex: 10,
            rowGap: 1,
          }}
          id="bm"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isConnected ? (
              <IconButton
                sx={{ color: "#fff" }}
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Ouvrir le menu de conversations"
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Tooltip title="Retour">
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => navigate("/")}
                  aria-label="Retour à l'accueil"
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            )}
            <Avatar
              src={chatbotMascot}
              alt="SunuChat Bot"
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{ letterSpacing: "-0.01em" }}
                >
                  SunuChat
                </Typography>
                <Chip
                  size="small"
                  icon={<BeenhereRoundedIcon />}
                  label="Multilingue"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Assistant vocal intelligent 🌍
              </Typography>
            </Box>
          </Box>
          {isConnected && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Mode éphémère</Typography>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={ephemere}
                      onChange={() => {
                        if (!ephemere) navigate("/chatbot");
                        setEphemere((prev) => !prev);
                      }}
                    />
                  }
                  labelPlacement="start"
                  sx={{
                    color: "#fff",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.9rem",
                      display: { xs: "none", sm: "block" },
                    },
                  }}
                />
              </Stack>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#fff",
                  color: PRIMARY_COLOR,
                  fontWeight: 800,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                onClick={() => {
                  localStorage.removeItem("token");
                  isConnected ? navigate("/chatbot") : navigate("/login");
                }}
              >
                {token ? "Déconnexion" : "Se connecter"}
              </Button>
            </Stack>
          )}
        </Box>

        {/* Offline banner */}
        {offline && (
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: "#fffbe6",
              borderBottom: "1px solid #ffecb3",
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <WifiOffRoundedIcon sx={{ color: "#b36b00" }} />
            <Typography variant="body2" sx={{ color: "#7a5200" }}>
              Vous êtes hors-ligne. Les réponses peuvent être indisponibles.
            </Typography>
          </Box>
        )}

        {/* Messages */}
        <Box
          ref={listRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            p: { xs: 2, md: 3 },
            backgroundColor: "#fafafa",
          }}
        >
          {chat.length === 0 && (
            <Card
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 3,
                border: "1px dashed rgba(0,0,0,0.12)",
                background: "linear-gradient(180deg, #fff, #ffffffcc)",
              }}
            >
              <CardContent>
                <Stack spacing={1.25} alignItems="center" textAlign="center">
                  <Avatar
                    src={chatbotMascot}
                    alt="SunuChat Bot"
                    sx={{ width: 72, height: 72 }}
                  />
                  <Typography variant="h6" fontWeight={900}>
                    Bienvenue sur SunuChat
                  </Typography>
                  <Typography color="text.secondary">
                    Posez une question en texte ou en voix. Wolof et Français
                    pris en charge.
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    justifyContent="center"
                    sx={{ mt: 1 }}
                  >
                    {quickPrompts.map((p) => (
                      <Chip
                        key={p}
                        label={p}
                        onClick={() => handleSendText(p)}
                        sx={{
                          bgcolor: `${PRIMARY_COLOR}10`,
                          color: PRIMARY_COLOR,
                          border: `1px solid ${PRIMARY_COLOR}33`,
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          <TransitionGroup>
            {chat.map((m, i) => renderMessage(m, i, chat[i - 1]))}
            {shouldShowTyping && <TypingBubble />}
          </TransitionGroup>
          <div ref={messagesEndRef} />
        </Box>

        {/* Scroll to bottom */}
        <FadeIn visible={showScrollDown}>
          <Fab
            size={isSmall ? "small" : "medium"}
            onClick={() => scrollToBottom(true)}
            sx={{
              position: "absolute",
              right: 16,
              bottom: 128,
              bgcolor: PRIMARY_COLOR,
              color: "#fff",
              "&:hover": { bgcolor: SECONDARY_COLOR },
            }}
            aria-label="Aller en bas"
          >
            <SouthRoundedIcon />
          </Fab>
        </FadeIn>

        {/* Composer */}
        <Composer
          userInput={userInput}
          setUserInput={setUserInput}
          handleSendText={handleSendText}
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          // Désormais l'état de chargement = attente bot (typing)
          isLoading={typing}
          cancelRecording={cancelRecording}
          recMs={recMs}
          vuLevel={vuLevel}
          uploadProgress={uploadProgress}
        />
      </Box>

      {/* Error snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3500}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ChatBotPage;

/* ===================== Helpers & Subcomponents ===================== */
function DayDivider({ date }) {
  const label = date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ my: 2, px: 1 }}
    >
      <Divider sx={{ flex: 1 }} />
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  );
}

function TypingBubble() {
  return (
    <MessageRow owner="bot">
      <Avatar
        sx={{ width: 40, height: 40 }}
        src={chatbotMascot}
        alt="SunuChat Bot"
      />
      <Paper
        sx={{
          p: 1.25,
          px: 2,
          borderRadius: "4px 16px 16px 16px",
          background: SECONDARY_COLOR,
          maxWidth: "60%",
        }}
      >
        <Stack direction="row" spacing={0.8}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fff",
                opacity: 0.9,
                animation: `blink 1.4s ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </Stack>
        <Box
          sx={{
            "@keyframes blink": {
              "0%": { opacity: 0.2 },
              "50%": { opacity: 1 },
              "100%": { opacity: 0.2 },
            },
          }}
        />
      </Paper>
    </MessageRow>
  );
}

function FadeIn({ visible, children }) {
  return (
    <Box
      sx={{
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 8}px)`,
        transition: "all .2s ease",
      }}
    >
      {children}
    </Box>
  );
}

function MessageRow({ owner, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: owner === "user" ? "row-reverse" : "row",
        gap: 1.5,
        mb: 2,
        alignItems: "flex-end",
      }}
    >
      {children}
    </Box>
  );
}

// >>> Fix copy: utilise copyText explicite + padding droit pour l’icône
function MessageBubble({ owner, children, copyable, copyText = "" }) {
  const bg = owner === "user" ? PRIMARY_COLOR : SECONDARY_COLOR;

  const copy = async () => {
    try {
      const text = typeof copyText === "string" ? copyText : "";
      if (text) await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        pl: 2,
        pr: copyable ? 5 : 2, // réserve de la place pour l'icône
        borderRadius:
          owner === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        background: bg,
        maxWidth: { xs: "85%", md: "70%" },
        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      {children}
      {copyable && (
        <Tooltip title="Copier">
          <IconButton
            size="small"
            onClick={copy}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              color: "#ffffffcc",
              backgroundColor: "rgba(255,255,255,0.08)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
            }}
            aria-label="Copier la réponse"
          >
            <ContentCopyRoundedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
}

/* ===================== Audio Message (custom player) ===================== */
function formatTime(sec) {
  if (!isFinite(sec)) return "--:--";
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(sec / 60).toString();
  return `${m}:${s}`;
}

function AudioMessage({ url, color, lastRate = 1, onRate, caption }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [rateAnchor, setRateAnchor] = useState(null);
  const progress = duration ? (current / duration) * 100 : 0;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.playbackRate = lastRate || 1;
    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, [lastRate]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  const onSeek = (e) => {
    const a = audioRef.current;
    if (!a) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = x / rect.width;
    a.currentTime = ratio * (a.duration || 0);
  };

  const setRate = (r) => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = r;
    onRate && onRate(r);
    setRateAnchor(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <IconButton
          size="small"
          onClick={toggle}
          sx={{
            bgcolor: "#ffffff22",
            color: "#fff",
            "&:hover": { bgcolor: "#ffffff33" },
          }}
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? (
            <StopIcon fontSize="small" />
          ) : (
            <MicIcon fontSize="small" />
          )}
        </IconButton>
        <Box
          onClick={onSeek}
          sx={{
            position: "relative",
            height: 6,
            flex: 1,
            borderRadius: 999,
            bgcolor: "#ffffff33",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progress}%`,
              bgcolor: "#fff",
              borderRadius: 999,
              transition: "width .1s linear",
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "#fff", minWidth: 56, textAlign: "right" }}
        >
          {formatTime(duration - current)}
        </Typography>
        <Tooltip title="Vitesse">
          <IconButton
            size="small"
            onClick={(e) => setRateAnchor(e.currentTarget)}
            sx={{ color: "#fff" }}
          >
            <SpeedRoundedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Télécharger">
          <IconButton
            size="small"
            component="a"
            href={url}
            download
            sx={{ color: "#fff" }}
          >
            <DownloadRoundedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={rateAnchor}
        open={Boolean(rateAnchor)}
        onClose={() => setRateAnchor(null)}
      >
        {PLAYBACK_RATES.map((r) => (
          <MenuItem key={r} onClick={() => setRate(r)}>
            {r}x
          </MenuItem>
        ))}
      </Menu>
      {/*caption && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 0.5, color: "#ffffffde" }}
        >
          {caption}
        </Typography>
      )*/}
      {/* Hidden native audio for decoding & playback */}
      <audio ref={audioRef} src={url} preload="metadata" />
    </Box>
  );
}

/* ===================== Composer with Recording Dock ===================== */
function msToClock(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  return `${m}:${ss}`;
}

function Composer({
  userInput,
  setUserInput,
  handleSendText,
  recording,
  startRecording,
  stopRecording,
  isLoading,
  cancelRecording,
  recMs,
  vuLevel,
  uploadProgress,
}) {
  const remaining = CHAR_LIMIT - userInput.length;
  const disabled = isLoading || recording || !userInput.trim();

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        p: { xs: 1.5, md: 2 },
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        boxShadow: "0 -6px 16px rgba(0,0,0,0.06)",
      }}
    >
      <TextField
        fullWidth
        placeholder="Écrivez un message… (Shift+Entrée pour une nouvelle ligne)"
        variant="outlined"
        value={userInput}
        onChange={(e) =>
          e.target.value.length <= CHAR_LIMIT && setUserInput(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
          }
        }}
        disabled={isLoading || recording}
        multiline
        maxRows={6}
        sx={{ bgcolor: "white", borderRadius: 2 }}
        inputProps={{ "aria-label": "Zone de saisie du message" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title={recording ? "Arrêter" : "Parler"}>
                <span>
                  <IconButton
                    onClick={recording ? stopRecording : startRecording}
                    disabled={isLoading}
                    sx={{ mr: 0.5 }}
                    aria-label="Bouton micro"
                  >
                    {recording ? (
                      <StopIcon color="error" />
                    ) : (
                      <MicIcon color="primary" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{ gap: 1, alignItems: "center" }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: remaining < 0 ? "error.main" : "text.disabled",
                  mr: 0.5,
                }}
              >
                {remaining}
              </Typography>
              <Tooltip title="Envoyer">
                <span>
                  <IconButton
                    onClick={() => handleSendText()}
                    disabled={disabled}
                    aria-label="Envoyer"
                  >
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon color={disabled ? "disabled" : "primary"} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      {/* Recording dock */}
      {recording && (
        <Box
          sx={{
            mt: 1.25,
            p: 1.25,
            borderRadius: 2,
            background: `${SECONDARY_COLOR}`,
            color: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <GraphicEqRoundedIcon sx={{ opacity: 0.9 }} />
              <Typography fontWeight={800}>Enregistrement en cours</Typography>
              <Chip
                size="small"
                label={msToClock(recMs)}
                sx={{
                  bgcolor: "#ffffff22",
                  color: "#fff",
                  border: "1px solid #ffffff44",
                }}
              />
            </Stack>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{ width: { xs: "100%", sm: 360 } }}
            >
              <VUBar vu={vuLevel} />
              <Button
                onClick={cancelRecording}
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<CloseIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#ffffff77",
                  color: "#fff",
                  "&:hover": { bgcolor: "#ffffff22", borderColor: "#ffffffaa" },
                }}
              >
                Annuler
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* Upload progress (after stop) */}
      {uploadProgress !== null && uploadProgress >= 0 && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            bgcolor: "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              Traitement audio…
            </Typography>
            <Typography
              variant="caption"
              sx={{ minWidth: 40, textAlign: "right" }}
            >
              {uploadProgress}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ mt: 1 }}
          />
        </Box>
      )}
    </Box>
  );
}

function VUBar({ vu }) {
  const pct = Math.min(100, Math.max(0, Math.round(vu * 100)));
  return (
    <Box
      sx={{
        flex: 1,
        height: 12,
        borderRadius: 999,
        bgcolor: "#ffffff33",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          bgcolor: "#fff",
          opacity: 0.9,
        }}
      />
    </Box>
  );
}
