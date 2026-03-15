// ChatBotPage.jsx — SunuChat · Conversational Premium
// Sidebar inline avec rename / delete, cohérence "Editorial Clean" complète
// + Sélecteur de langue manuel (Français / Wolof)
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Box, Typography, IconButton, Button, TextField,
  CircularProgress, LinearProgress, Tooltip, Drawer,
  Switch, Stack, Snackbar, Alert, Divider,
  useMediaQuery, Menu, MenuItem, styled,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import MicIcon                          from "@mui/icons-material/Mic";
import StopIcon                         from "@mui/icons-material/Stop";
import CloseIcon                        from "@mui/icons-material/Close";
import SendRoundedIcon                  from "@mui/icons-material/SendRounded";
import MenuRoundedIcon                  from "@mui/icons-material/MenuRounded";
import ArrowBackRoundedIcon             from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon                  from "@mui/icons-material/HomeRounded";
import VerifiedRoundedIcon              from "@mui/icons-material/VerifiedRounded";
import ContentCopyRoundedIcon           from "@mui/icons-material/ContentCopyRounded";
import KeyboardArrowDownRoundedIcon     from "@mui/icons-material/KeyboardArrowDownRounded";
import WifiOffRoundedIcon               from "@mui/icons-material/WifiOffRounded";
import DownloadRoundedIcon              from "@mui/icons-material/DownloadRounded";
import PlayArrowRoundedIcon             from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon                 from "@mui/icons-material/PauseRounded";
import NorthEastRoundedIcon             from "@mui/icons-material/NorthEastRounded";
import AddRoundedIcon                   from "@mui/icons-material/AddRounded";
import ChatBubbleOutlineRoundedIcon     from "@mui/icons-material/ChatBubbleOutlineRounded";
import DeleteOutlineRoundedIcon         from "@mui/icons-material/DeleteOutlineRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import MoreHorizRoundedIcon             from "@mui/icons-material/MoreHorizRounded";
import CheckRoundedIcon                 from "@mui/icons-material/CheckRounded";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import chatbotMascot from "../assets/icons/mascotteSunuchat.png";
import { useNavigate, useParams } from "react-router-dom";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

/* ── design tokens ──────────────────────────────────────────────── */
const T = {
  canvas:     "#F6F7F9",
  surface:    "#FFFFFF",
  surfaceHov: "#F0F2F6",
  header:     "#FFFFFF",
  sidebar:    "#FFFFFF",
  ink:        "#111318",
  inkSub:     "#515666",
  inkMuted:   "#9EA5B8",
  inkOnBrand: "#FFFFFF",
  brand:      PRIMARY_COLOR,
  brandAlt:   SECONDARY_COLOR,
  border:     "rgba(0,0,0,0.07)",
  borderMed:  "rgba(0,0,0,0.11)",
  danger:     "#E03140",
  success:    "#1AB57A",
  font:       "'DM Sans','Helvetica Neue',sans-serif",
  ease:       "cubic-bezier(0.25,0.46,0.45,0.94)",
  spring:     "cubic-bezier(0.34,1.56,0.64,1)",
  shadowXs:   "0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shadowSm:   "0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04)",
  shadowMd:   "0 8px 28px rgba(0,0,0,0.10),0 2px 6px rgba(0,0,0,0.05)",
  shadowLg:   "0 20px 48px rgba(0,0,0,0.12),0 4px 12px rgba(0,0,0,0.06)",
};

const CHAR_LIMIT     = 1800;
const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];
const WAVE_H = [30,55,75,90,60,80,40,70,55,95,65,45,85,55,70,35,88,62,78,50,68,42,82,58];
const API = process.env.REACT_APP_BACK_URL;

/* ── Pill switch ─────────────────────────────────────────────────── */
const PillSwitch = styled(Switch)(() => ({
  width: 40, height: 22, padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2, color: "#fff",
    "&.Mui-checked": {
      transform: "translateX(18px)", color: "#fff",
      "& + .MuiSwitch-track": { backgroundColor: PRIMARY_COLOR, opacity: 1 },
    },
  },
  "& .MuiSwitch-thumb": { width: 18, height: 18 },
  "& .MuiSwitch-track": { borderRadius: 11, backgroundColor: "#C8CCDA", opacity: 1 },
}));

/* ── Language Selector ───────────────────────────────────────────── */
function LangSelector({ lang, setLang }) {
  const langs = [
    { code: "fr", flag: "🇫🇷", label: "Français" },
    { code: "wo", flag: "🇸🇳", label: "Wolof" },
  ];
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}
      sx={{
        bgcolor: T.canvas,
        border: `1px solid ${T.borderMed}`,
        borderRadius: "10px",
        p: "3px",
        flexShrink: 0,
      }}>
      {langs.map((l) => {
        const active = lang === l.code;
        return (
          <Box
            key={l.code}
            onClick={() => setLang(l.code)}
            sx={{
              display: "flex", alignItems: "center", gap: "5px",
              px: 1, py: 0.5,
              borderRadius: "7px",
              cursor: "pointer",
              bgcolor: active ? T.surface : "transparent",
              boxShadow: active ? T.shadowXs : "none",
              border: active ? `1px solid ${T.border}` : "1px solid transparent",
              transition: `all .18s ${T.ease}`,
              "&:hover": active ? {} : { bgcolor: T.surfaceHov },
            }}
          >
            <Typography sx={{ fontSize: 13 }}>{l.flag}</Typography>
            <Typography sx={{
              fontFamily: T.font,
              fontSize: 11.5,
              fontWeight: active ? 700 : 500,
              color: active ? PRIMARY_COLOR : T.inkSub,
              lineHeight: 1,
              display: { xs: "none", sm: "block" },
            }}>
              {l.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

/* ═══════════════════════ SIDEBAR ═══════════════════════════════════ */
function Sidebar({ conversations, setConversations, selectedId, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuConvId, setMenuConvId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal,  setRenameVal]  = useState("");
  const [deleteDialogId, setDeleteDialogId] = useState(null);

  const openMenu = (e, id) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuConvId(id);
  };
  const closeMenu = () => { setMenuAnchor(null); setMenuConvId(null); };

  const askDelete = (id) => {
    setMenuAnchor(null);
    setMenuConvId(null);
    setTimeout(() => setDeleteDialogId(id), 80);
  };

  const confirmDelete = async () => {
    const id = deleteDialogId;
    setDeleteDialogId(null);
    try {
      await axios.delete(`${API}/conversations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setConversations((p) => p.filter((c) => c._id !== id));
      if (selectedId === id) navigate("/chatbot");
    } catch {}
  };

  const startRename = (id, current) => {
    setMenuAnchor(null);
    setMenuConvId(null);
    setRenameVal(current || "");
    setTimeout(() => setRenamingId(id), 120);
  };

  const commitRename = async (id) => {
    const title = renameVal.trim();
    if (!title) { setRenamingId(null); return; }
    try {
      await axios.patch(`${API}/conversations/${id}/rename`, { title },
        { headers: { Authorization: `Bearer ${token}` } });
      setConversations((p) => p.map((c) => c._id === id ? { ...c, title } : c));
    } catch {}
    setRenamingId(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: T.sidebar }}>

      {/* Header */}
      <Box sx={{ px: 2, pt: 2.5, pb: 1.75, borderBottom: `1px solid ${T.border}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.75}>
          <Typography sx={{ fontFamily: T.font, fontWeight: 700, fontSize: "0.9rem", color: T.ink, letterSpacing: "-0.01em" }}>
            Conversations
          </Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose}
              sx={{ color: T.inkMuted, borderRadius: "7px", "&:hover": { bgcolor: T.surfaceHov, color: T.ink } }}>
              <CloseIcon sx={{ fontSize: 15 }} />
            </IconButton>
          )}
        </Stack>

        <Button fullWidth variant="outlined"
          startIcon={<AddRoundedIcon sx={{ fontSize: 15 }} />}
          onClick={() => { navigate("/chatbot"); onClose?.(); }}
          disableElevation
          sx={{
            fontFamily: T.font, fontWeight: 600, fontSize: "0.8rem",
            textTransform: "none", borderRadius: "10px", py: 0.875,
            borderColor: T.borderMed, color: T.inkSub,
            "&:hover": { borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR, bgcolor: `${PRIMARY_COLOR}07` },
            transition: `all .18s ${T.ease}`,
          }}>
          Nouvelle conversation
        </Button>
      </Box>

      {/* List */}
      <Box sx={{
        flex: 1, overflowY: "auto", px: 1.25, py: 1.25,
        "&::-webkit-scrollbar": { width: 3 },
        "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.08)", borderRadius: 4 },
      }}>
        {conversations.length === 0 && (
          <Box sx={{ textAlign: "center", pt: 4, px: 2 }}>
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 26, color: T.inkMuted, mb: 1 }} />
            <Typography sx={{ fontFamily: T.font, fontSize: "0.8rem", color: T.inkMuted, lineHeight: 1.6 }}>
              Aucune conversation enregistrée
            </Typography>
          </Box>
        )}

        {conversations.map((conv) => {
          const isSelected = conv._id === selectedId;
          const isRenaming = renamingId === conv._id;
          return (
            <Box
              key={conv._id}
              onClick={() => { if (!isRenaming) { navigate(`/chatbot/conv/${conv._id}`); onClose?.(); } }}
              sx={{
                position: "relative",
                px: 1.375, py: 1,
                borderRadius: "10px", mb: 0.25,
                cursor: isRenaming ? "default" : "pointer",
                bgcolor: isSelected ? `${PRIMARY_COLOR}0D` : "transparent",
                border: `1px solid ${isSelected ? `${PRIMARY_COLOR}25` : "transparent"}`,
                transition: `all .15s ${T.ease}`,
                "&:hover": isRenaming ? {} : {
                  bgcolor: isSelected ? `${PRIMARY_COLOR}0D` : T.surfaceHov,
                  "& .conv-menu-btn": { opacity: 1 },
                },
                "& .conv-menu-btn": { opacity: isSelected ? 1 : 0, transition: "opacity .15s" },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <ChatBubbleOutlineRoundedIcon sx={{
                  fontSize: 13, flexShrink: 0, mt: "1px",
                  color: isSelected ? PRIMARY_COLOR : T.inkMuted,
                }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {isRenaming ? (
                    <TextField
                      autoFocus size="small" value={renameVal}
                      onChange={(e) => setRenameVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(conv._id);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onBlur={() => setTimeout(() => commitRename(conv._id), 150)}
                      onClick={(e) => e.stopPropagation()}
                      variant="standard"
                      InputProps={{ disableUnderline: false }}
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": { fontFamily: T.font, fontSize: "0.82rem", color: T.ink, py: "2px" },
                        "& .MuiInput-underline:after": { borderBottomColor: PRIMARY_COLOR },
                      }}
                    />
                  ) : (
                    <Typography sx={{
                      fontFamily: T.font, fontSize: "0.82rem",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? T.ink : T.inkSub,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {conv.title || "Nouvelle conversation"}
                    </Typography>
                  )}
                </Box>
                {!isRenaming && (
                  <IconButton
                    className="conv-menu-btn"
                    size="small"
                    onClick={(e) => openMenu(e, conv._id)}
                    sx={{
                      width: 22, height: 22, borderRadius: "6px", flexShrink: 0,
                      color: T.inkMuted,
                      "&:hover": { bgcolor: T.borderMed, color: T.ink },
                    }}
                  >
                    <MoreHorizRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "12px",
            boxShadow: T.shadowLg,
            minWidth: 172, py: 0.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            const id = menuConvId;
            const conv = conversations.find((c) => c._id === id);
            startRename(id, conv?.title);
          }}
          sx={{
            fontFamily: T.font, fontSize: "0.84rem", color: T.inkSub,
            gap: 1.25, px: 1.75, py: 1, borderRadius: "8px", mx: 0.5,
            "&:hover": { bgcolor: T.surfaceHov, color: T.ink },
          }}
        >
          <DriveFileRenameOutlineRoundedIcon sx={{ fontSize: 16 }} />
          Renommer
        </MenuItem>
        <Divider sx={{ my: 0.5, mx: 1.75, borderColor: T.border }} />
        <MenuItem
          onClick={() => { const id = menuConvId; askDelete(id); }}
          sx={{
            fontFamily: T.font, fontSize: "0.84rem", color: T.danger,
            gap: 1.25, px: 1.75, py: 1, borderRadius: "8px", mx: 0.5,
            "&:hover": { bgcolor: "rgba(224,49,64,0.07)" },
          }}
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(deleteDialogId)}
        onClose={() => setDeleteDialogId(null)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: T.shadowLg,
            border: `1px solid ${T.border}`,
            minWidth: 300,
            p: 0.5,
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: T.font, fontWeight: 700, fontSize: "1rem", color: T.ink, pb: 0.5 }}>
          Supprimer la conversation ?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: T.font, fontSize: "0.875rem", color: T.inkSub, lineHeight: 1.6 }}>
            Cette action est irréversible. La conversation et tous ses messages seront définitivement supprimés.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogId(null)}
            sx={{
              fontFamily: T.font, fontWeight: 600, fontSize: "0.82rem",
              textTransform: "none", borderRadius: "10px", px: 2, py: 0.75,
              color: T.inkSub, border: `1px solid ${T.borderMed}`,
              "&:hover": { bgcolor: T.surfaceHov, color: T.ink },
            }}>
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              fontFamily: T.font, fontWeight: 600, fontSize: "0.82rem",
              textTransform: "none", borderRadius: "10px", px: 2, py: 0.75,
              bgcolor: T.danger, color: "#fff",
              "&:hover": { bgcolor: "#c0272f" },
              boxShadow: `0 4px 12px ${T.danger}40`,
            }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ═══════════════════════ PAGE ══════════════════════════════════════ */
export default function ChatBotPage() {
  const [chat, setChat]               = useState([]);
  const [recording, setRecording]     = useState(false);
  const [userInput, setUserInput]     = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [error, setError]             = useState("");
  const [offline, setOffline]         = useState(!navigator.onLine);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [lastRate, setLastRate] = useState(() => Number(localStorage.getItem("sunuchat_rate") || 1));
  const [typing, setTyping]     = useState(false);
  const [ephemere, setEphemere] = useState(false);

  // ── Langue sélectionnée : "fr" ou "wo" ──
  const [lang, setLang] = useState("fr");

  const pendingRef  = useRef(0);
  const delayRef    = useRef(null);
  const mediaRecRef = useRef(null);
  const chunksRef   = useRef([]);
  const streamRef   = useRef(null);
  const listRef     = useRef(null);
  const bottomRef   = useRef(null);
  const rafRef      = useRef(null);
  const ctxRef      = useRef(null);
  const analyserRef = useRef(null);
  const srcRef      = useRef(null);
  const timerRef    = useRef(null);

  const [recMs, setRecMs]     = useState(0);
  const [vuLevel, setVuLevel] = useState(0);

  const navigate = useNavigate();
  const { id: convId } = useParams();
  const token  = localStorage.getItem("token");
  const isConn = !!token;
  const isMd   = useMediaQuery("(min-width:900px)");

  // En wolof, seul l'audio est dispo
  const isWolof = lang === "wo";

  const prompts = useMemo(() => [
    { label: "Symptômes de la dengue ?",            icon: "🦟" },
    { label: "Prévenir le paludisme en wolof",       icon: "🌿" },
    { label: "Fièvre enfant 3 jours — que faire ?",  icon: "🌡️" },
    { label: "Quand aller au poste de santé ?",      icon: "🏥" },
  ], []);

  const scrollToBottom = useCallback((s = true) =>
    bottomRef.current?.scrollIntoView({ behavior: s ? "smooth" : "auto" }), []);

  useEffect(() => { if (isMd && isConn) setSidebarOpen(true); }, [isMd, isConn]);

  useEffect(() => {
    const el = listRef.current; if (!el) return;
    const fn = () => setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 180);
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { scrollToBottom(true); }, [chat, typing]);

  useEffect(() => {
    const on = () => setOffline(false), off = () => setOffline(true);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => {
    if (!convId) { setChat([]); return; }
    (async () => {
      try {
        const r = await axios.get(`${API}/conversations/${convId}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setChat(r.data.messages.map((m) => ({
          sender: m.sender, message_type: m.message_type,
          content: m.content, audio_path: m.audio_path, timestamp: m.timestamp,
        })));
        console.log('conv', r);
      } catch { setError("Impossible de charger la conversation."); }
    })();
  }, [convId]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const r = await axios.get(`${API}/conversations`,
          { headers: { Authorization: `Bearer ${token}` } });
        setConversations(r.data);
      } catch {}
    })();
  }, [convId]);

  /* ── recording ── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecRef.current = mr; streamRef.current = stream; chunksRef.current = [];
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize = 1024;
      const src = ctx.createMediaStreamSource(stream); src.connect(an);
      ctxRef.current = ctx; analyserRef.current = an; srcRef.current = src;
      const buf = new Uint8Array(an.frequencyBinCount);
      const loop = () => {
        an.getByteTimeDomainData(buf);
        let p = 0; for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs((buf[i]-128)/128));
        setVuLevel(p); rafRef.current = requestAnimationFrame(loop);
      };
      loop();
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => handleSendAudio(langRef.current);
      mr.start(); setRecording(true); setRecMs(0);
      timerRef.current = setInterval(() => setRecMs((t) => t + 100), 100);
    } catch { setError("Micro non accessible. Vérifiez les permissions."); }
  };

  const cleanAudio = () => {
    cancelAnimationFrame(rafRef.current);
    try { srcRef.current?.disconnect(); } catch {}
    try { analyserRef.current?.disconnect(); } catch {}
    try { ctxRef.current?.close(); } catch {}
  };

  const stopRecording = () => {
    mediaRecRef.current?.stop(); streamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false); clearInterval(timerRef.current); cleanAudio();
  };

  const cancelRecording = () => {
    if (mediaRecRef.current) mediaRecRef.current.onstop = null;
    mediaRecRef.current?.stop(); streamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false); clearInterval(timerRef.current); cleanAudio();
  };

  const beginWait = () => {
    pendingRef.current += 1;
    if (delayRef.current) clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => { if (pendingRef.current > 0) setTyping(true); }, 250);
  };
  const endWait = () => {
    pendingRef.current = Math.max(0, pendingRef.current - 1);
    if (pendingRef.current === 0) { clearTimeout(delayRef.current); setTyping(false); }
  };

  /* ── send audio ── */
  // Ref mise à jour à chaque render — garantit la valeur courante dans les callbacks async
  const langRef = useRef(lang);
  langRef.current = lang;

  const handleSendAudio = async (currentLang = langRef.current) => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const ts = new Date().toISOString();

    setChat((p) => [...p, { sender:"user", message_type:"audio", content:"Audio envoyé",
      audio_path: URL.createObjectURL(blob), timestamp: ts }]);
    setUploadProgress(5); beginWait();
    try {
      // Upload pour URL persistante
      const fd = new FormData(); fd.append("audio", blob);
      const up = await axios.post(`${API}/upload_audio`, fd,
        { onUploadProgress: (e) => e.total && setUploadProgress(Math.max(5, Math.round(e.loaded/e.total*100))) });
      const uMsg = { sender:"user", message_type:"audio", content:"Audio envoyé",
        audio_path: up.data.audio_url, timestamp: ts };

      // FormData séparé pour le bot — on inclut la langue choisie
      const fdBot = new FormData();
      fdBot.append("audio", blob);
      fdBot.append("lang", currentLang); // 👈 clé ajoutée

      if (isConn && !convId && !ephemere) {
        const res = await axios.post(`${API}/conversations/first-message`, uMsg,
          { headers: { Authorization: `Bearer ${token}` } });
        const nid = res.data.conversation_id;
        const br = await axios.post(`${API}/chatbot`, fdBot);
        const bMsg = { sender:"bot", message_type:"audio", content: br.data.text,
          audio_path: br.data.audio_url, timestamp: new Date().toISOString() };
        setChat((p) => [...p, bMsg]);
        await axios.post(`${API}/conversations/${nid}/message`, bMsg,
          { headers: { Authorization: `Bearer ${token}` } });
        navigate(`/chatbot/conv/${nid}`);
      } else if (isConn && convId && !ephemere) {
        await axios.post(`${API}/conversations/${convId}/message`, uMsg,
          { headers: { Authorization: `Bearer ${token}` } });
        const br = await axios.post(`${API}/chatbot`, fdBot);
        const bMsg = { sender:"bot", message_type:"audio", content: br.data.text,
          audio_path: br.data.audio_url, timestamp: new Date().toISOString() };
        setChat((p) => [...p, bMsg]);
        await axios.post(`${API}/conversations/${convId}/message`, bMsg,
          { headers: { Authorization: `Bearer ${token}` } });
      } else {
        const br = await axios.post(`${API}/chatbot`, fdBot);
        setChat((p) => [...p, { sender:"bot", message_type:"audio", content: br.data.text,
          audio_path: br.data.audio_url, timestamp: new Date().toISOString() }]);
      }
    } catch (e) {
      console.error("Audio send error:", e?.response?.data || e.message);
      setError("Échec de l'envoi de l'audio.");
    }
    finally { endWait(); setTimeout(() => setUploadProgress(null), 400); }
  };

  /* ── send text (français uniquement) ── */
  const handleSendText = async (forced) => {
    if (isWolof) return; // sécurité — le bouton est déjà désactivé côté UI
    const text = typeof forced === "string" ? forced : userInput.trim();
    if (!text) return;
    const uMsg = { sender:"user", message_type:"text", content: text,
      audio_path: null, timestamp: new Date().toISOString() };
    setChat((p) => [...p, uMsg]); setUserInput(""); beginWait();
    try {
      const res = await axios.post(`${API}/chatbotext`, { text });
      const bMsg = { sender:"bot", message_type:"text", content: res.data.reponse,
        audio_path: null, timestamp: new Date().toISOString() };
      setChat((p) => [...p, bMsg]);
      if (isConn && !ephemere) {
        if (!convId) {
          const r = await axios.post(`${API}/conversations/first-message`, uMsg,
            { headers: { Authorization: `Bearer ${token}` } });
          await axios.post(`${API}/conversations/${r.data.conversation_id}/message`, bMsg,
            { headers: { Authorization: `Bearer ${token}` } });
          navigate(`/chatbot/conv/${r.data.conversation_id}`);
        } else {
          await axios.post(`${API}/conversations/${convId}/message`, uMsg,
            { headers: { Authorization: `Bearer ${token}` } });
          await axios.post(`${API}/conversations/${convId}/message`, bMsg,
            { headers: { Authorization: `Bearer ${token}` } });
        }
      }
    } catch { setError("Message non envoyé. Réessayez."); }
    finally { endWait(); }
  };

  /* ── render message ── */
  const renderMsg = (m, i, prev) => {
    const today  = new Date(m.timestamp).toDateString();
    const prevDay = prev ? new Date(prev.timestamp).toDateString() : null;
    const isUser = m.sender === "user";
    return (
      <CSSTransition key={i} timeout={360} classNames="msg">
        <Box>
          {today !== prevDay && <DayChip date={new Date(m.timestamp)} />}
          <MsgRow isUser={isUser}>
            {!isUser && <BotAvatar />}
            <Bubble isUser={isUser} timestamp={m.timestamp}
              copyable={!isUser && m.message_type === "text"} copyText={m.content ?? ""}>
              {m.message_type === "text"
                ? <Typography sx={{
                    fontFamily: T.font, color: isUser ? T.inkOnBrand : T.ink,
                    fontWeight: 400, fontSize: 14.5, lineHeight: 1.72,
                    whiteSpace: "pre-wrap", letterSpacing: "0.005em",
                  }}>
                    {m.content}
                  </Typography>
                : <AudioPlayer url={m.audio_path} isUser={isUser} lastRate={lastRate}
                    onRate={(r) => { setLastRate(r); localStorage.setItem("sunuchat_rate", String(r)); }} />
              }
            </Bubble>
            {isUser && <UserAvatar />}
          </MsgRow>
        </Box>
      </CSSTransition>
    );
  };

  const showDesktopSidebar = isConn && sidebarOpen && isMd;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .msg-enter        { opacity:0; transform:translateY(12px) scale(0.98); }
        .msg-enter-active { opacity:1; transform:none; transition:opacity 300ms ${T.ease},transform 360ms ${T.spring}; }
        .msg-exit         { opacity:1; }
        .msg-exit-active  { opacity:0; transition:opacity 160ms ease; }
        .chat-list::-webkit-scrollbar       { width:4px; }
        .chat-list::-webkit-scrollbar-track { background:transparent; }
        .chat-list::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.10); border-radius:4px; }
        @keyframes tdot      { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes audioWave { 0%,100%{transform:scaleY(0.3);opacity:.4} 50%{transform:scaleY(1);opacity:1} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes recRing   { 0%{box-shadow:0 0 0 0 rgba(224,49,64,.55)} 70%{box-shadow:0 0 0 8px rgba(224,49,64,0)} 100%{box-shadow:0 0 0 0 rgba(224,49,64,0)} }
        @keyframes onlineDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes sendPop   { 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
      `}</style>

      <Box sx={{ display:"flex", height:"100vh", overflow:"hidden", bgcolor:T.canvas, fontFamily:T.font }}>

        {/* Desktop sidebar */}
        {showDesktopSidebar && (
          <Box sx={{
            width: 268, flexShrink: 0,
            bgcolor: T.sidebar,
            borderRight: `1px solid ${T.border}`,
            boxShadow: "1px 0 0 0 rgba(0,0,0,0.04)",
          }}>
            <Sidebar
              conversations={conversations}
              setConversations={setConversations}
              selectedId={convId}
            />
          </Box>
        )}

        {/* Mobile drawer */}
        <Drawer anchor="left" open={sidebarOpen && !isMd}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs:"block", md:"none" },
            "& .MuiDrawer-paper": { width:280, bgcolor:T.sidebar, border:"none", boxShadow:T.shadowLg },
          }}>
          <Sidebar
            conversations={conversations}
            setConversations={setConversations}
            selectedId={convId}
            onClose={() => setSidebarOpen(false)}
          />
        </Drawer>

        {/* Main column */}
        <Box sx={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, minHeight:0, position:"relative" }}>

          {/* HEADER */}
          <Box sx={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            px:{ xs:1.5, md:2.5 }, height:60,
            bgcolor:T.header, borderBottom:`1px solid ${T.border}`,
            flexShrink:0, position:"sticky", top:0, zIndex:20,
          }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Tooltip title={isConn ? "Menu" : "Retour"} arrow>
                <IconButton onClick={() => isConn ? setSidebarOpen((p) => !p) : navigate("/")}
                  size="small"
                  sx={{ color:T.inkSub, borderRadius:2, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink }, transition:`all .18s ${T.ease}` }}>
                  {isConn ? <MenuRoundedIcon sx={{ fontSize:20 }} /> : <ArrowBackRoundedIcon sx={{ fontSize:20 }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Accueil" arrow>
                <IconButton onClick={() => navigate("/")} size="small"
                  sx={{ color:T.inkSub, borderRadius:2, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink }, transition:`all .18s ${T.ease}` }}>
                  <HomeRoundedIcon sx={{ fontSize:20 }} />
                </IconButton>
              </Tooltip>

              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box sx={{ position:"relative", flexShrink:0 }}>
                  <Box sx={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", border:`2px solid ${T.border}`, boxShadow:`0 0 0 2px ${PRIMARY_COLOR}22` }}>
                    <img src={chatbotMascot} alt="SunuChat" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </Box>
                  <Box sx={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", bgcolor:T.success, border:`2px solid ${T.header}`, animation:"onlineDot 2.8s ease infinite" }} />
                </Box>
                <Box sx={{ lineHeight:1 }}>
                  <Stack direction="row" alignItems="center" spacing={0.625} sx={{ mb:"1px" }}>
                    <Typography sx={{ fontFamily:T.font, fontWeight:700, fontSize:14, color:T.ink, letterSpacing:"-0.01em", lineHeight:1 }}>
                      SunuChat
                    </Typography>
                    <Box sx={{ display:"flex", alignItems:"center", gap:"2px", px:0.75, py:"2px", borderRadius:99, background:`linear-gradient(120deg, ${PRIMARY_COLOR}18, ${SECONDARY_COLOR}14)`, border:`1px solid ${PRIMARY_COLOR}30` }}>
                      <VerifiedRoundedIcon sx={{ fontSize:9, color:PRIMARY_COLOR }} />
                      <Typography sx={{ fontSize:8.5, fontWeight:700, color:PRIMARY_COLOR, letterSpacing:"0.07em", textTransform:"uppercase" }}>Multilingue</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ fontSize:11, color:T.inkMuted, fontWeight:400, lineHeight:1 }}>Wolof · Français · Santé IA</Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Right side du header : lang selector + éphémère + déconnexion */}
            <Stack direction="row" alignItems="center" spacing={1.5}>

              {/* ── Sélecteur de langue ── */}
              <LangSelector lang={lang} setLang={setLang} />

              {isConn ? (
                <>
                  <Stack direction="row" alignItems="center" spacing={0.875} sx={{ display:{ xs:"none", sm:"flex" } }}>
                    <Typography sx={{ fontSize:11.5, fontWeight:500, color:T.inkSub }}>Éphémère</Typography>
                    <PillSwitch checked={ephemere} onChange={() => { if (!ephemere) navigate("/chatbot"); setEphemere((p) => !p); }} />
                  </Stack>
                  <Button size="small"
                    onClick={() => { localStorage.removeItem("token"); navigate("/chatbot"); }}
                    sx={{ fontFamily:T.font, fontWeight:600, fontSize:12, textTransform:"none", color:T.inkSub, border:`1px solid ${T.borderMed}`, borderRadius:"10px", px:1.75, py:0.6, lineHeight:1.5, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink, borderColor:"rgba(0,0,0,0.18)" }, transition:`all .18s ${T.ease}` }}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button size="small"
                  onClick={() => navigate("/login")}
                  sx={{ fontFamily:T.font, fontWeight:600, fontSize:12, textTransform:"none", color:"#fff", bgcolor:PRIMARY_COLOR, borderRadius:"10px", px:1.75, py:0.6, lineHeight:1.5, boxShadow:`0 4px 12px ${PRIMARY_COLOR}40`, "&:hover":{ bgcolor:SECONDARY_COLOR, boxShadow:`0 4px 16px ${SECONDARY_COLOR}50` }, transition:`all .18s ${T.ease}` }}>
                  Connexion
                </Button>
              )}
            </Stack>
          </Box>

          {/* Offline */}
          {offline && (
            <Box sx={{ px:2.5, py:0.75, bgcolor:"#FFFBEB", borderBottom:"1px solid #FDE68A", display:"flex", alignItems:"center", gap:1 }}>
              <WifiOffRoundedIcon sx={{ fontSize:14, color:"#D97706" }} />
              <Typography sx={{ fontFamily:T.font, fontSize:12, fontWeight:500, color:"#92400E" }}>
                Hors-ligne — les réponses peuvent être indisponibles
              </Typography>
            </Box>
          )}

          {/* Bandeau info Wolof */}
          {isWolof && (
            <Box sx={{ px:2.5, py:0.75, bgcolor:`${PRIMARY_COLOR}08`, borderBottom:`1px solid ${PRIMARY_COLOR}20`, display:"flex", alignItems:"center", gap:1 }}>
              <Typography sx={{ fontSize:13 }}>🇸🇳</Typography>
              <Typography sx={{ fontFamily:T.font, fontSize:12, fontWeight:500, color:PRIMARY_COLOR }}>
                Mode Wolof actif — utilisez le micro pour envoyer votre message vocal
              </Typography>
            </Box>
          )}

          {/* MESSAGES */}
          <Box ref={listRef} className="chat-list" sx={{
            flex:1, overflowY:"auto", minHeight:0,
            px:{ xs:2, sm:4, md:"12%", lg:"18%" }, py:3,
            bgcolor:T.canvas,
            backgroundImage:`
              radial-gradient(ellipse 55% 30% at 8%  0%, ${PRIMARY_COLOR}0D 0%, transparent 60%),
              radial-gradient(ellipse 40% 25% at 92% 100%, ${SECONDARY_COLOR}09 0%, transparent 55%)
            `,
          }}>

            {/* Welcome */}
            {chat.length === 0 && (
              <Box sx={{ maxWidth:480, mx:"auto", textAlign:"center", pt:{ xs:4, md:6 }, animation:"fadeUp .5s ease both" }}>
                <Box sx={{ position:"relative", width:80, height:80, mx:"auto", mb:3 }}>
                  <Box sx={{ position:"absolute", inset:-3, borderRadius:"50%", background:`conic-gradient(from 0deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR}, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}, ${PRIMARY_COLOR})`, animation:"spin 5s linear infinite", opacity:0.7 }} />
                  <Box sx={{ position:"absolute", inset:1, borderRadius:"50%", bgcolor:T.canvas }} />
                  <Box sx={{ position:"absolute", inset:4, borderRadius:"50%", overflow:"hidden" }}>
                    <img src={chatbotMascot} alt="SunuChat" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </Box>
                </Box>
                <Typography sx={{ fontFamily:T.font, fontWeight:700, fontSize:{ xs:"1.5rem", md:"1.7rem" }, color:T.ink, letterSpacing:"-0.025em", mb:1 }}>
                  Bonjour, je suis SunuChat
                </Typography>
                <Typography sx={{ fontSize:14, color:T.inkSub, lineHeight:1.75, mb:3.5, maxWidth:360, mx:"auto" }}>
                  {isWolof
                    ? "Mode Wolof activé. Appuyez sur le micro pour parler — je vous répondrai en wolof."
                    : "Votre assistant santé multilingue. Posez vos questions en texte ou en voix — Wolof et Français pris en charge."
                  }
                </Typography>

                {/* Suggestions rapides (français seulement) */}
                {!isWolof && (
                  <Box sx={{ display:"flex", flexDirection:"column", gap:1, textAlign:"left" }}>
                    <Typography sx={{ fontSize:9.5, fontWeight:700, color:T.inkMuted, letterSpacing:"0.09em", textTransform:"uppercase", mb:0.5, textAlign:"center" }}>
                      Suggestions rapides
                    </Typography>
                    {prompts.map((p, i) => (
                      <Box key={p.label} onClick={() => handleSendText(p.label)} sx={{
                        display:"flex", alignItems:"center", justifyContent:"space-between", gap:1.5,
                        px:2, py:1.375, bgcolor:T.surface, border:`1px solid ${T.border}`,
                        borderRadius:"14px", cursor:"pointer", boxShadow:T.shadowXs,
                        animation:`fadeUp .35s ${.08+i*.07}s ease both`, opacity:0,
                        transition:`all .2s ${T.ease}`,
                        "&:hover":{ borderColor:`${PRIMARY_COLOR}50`, boxShadow:`${T.shadowSm}, 0 0 0 3px ${PRIMARY_COLOR}0C`, transform:"translateY(-1px)", "& .arr":{ opacity:1, transform:"translate(0,0)" } },
                        "&:active":{ transform:"translateY(0)" },
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box sx={{ width:34, height:34, borderRadius:"10px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg, ${PRIMARY_COLOR}14, ${SECONDARY_COLOR}0E)`, border:`1px solid ${PRIMARY_COLOR}20`, fontSize:16 }}>
                            {p.icon}
                          </Box>
                          <Typography sx={{ fontFamily:T.font, fontSize:13.5, fontWeight:500, color:T.ink }}>{p.label}</Typography>
                        </Stack>
                        <NorthEastRoundedIcon className="arr" sx={{ fontSize:14, color:T.inkMuted, flexShrink:0, opacity:0, transform:"translate(-3px, 3px)", transition:`all .2s ${T.ease}` }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <TransitionGroup>
              {chat.map((m, i) => renderMsg(m, i, chat[i-1]))}
            </TransitionGroup>

            {typing && (
              <Box sx={{ display:"flex", alignItems:"flex-end", gap:1.25, mb:1.5, animation:`fadeUp .28s ${T.spring}` }}>
                <BotAvatar />
                <Box sx={{ px:2, py:1.375, bgcolor:T.surface, border:`1px solid ${T.border}`, borderRadius:"4px 16px 16px 16px", boxShadow:T.shadowSm, display:"flex", alignItems:"center", gap:"5px" }}>
                  {uploadProgress !== null ? (
                    <>
                      {[0,1,2,3,4,5,6].map((j) => (
                        <Box key={j} sx={{
                          width: 3, height: 18, borderRadius: 999,
                          bgcolor: SECONDARY_COLOR,
                          transformOrigin: "center",
                          animation: `audioWave 0.9s ${j * 0.1}s infinite ease-in-out`,
                        }} />
                      ))}
                    </>
                  ) : (
                    [0,1,2].map((j) => (
                      <Box key={j} sx={{ width:7, height:7, borderRadius:"50%", bgcolor:SECONDARY_COLOR, animation:`tdot 1.35s ${j*.18}s infinite ease` }} />
                    ))
                  )}
                </Box>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Scroll FAB */}
          {showScrollDown && (
            <Box sx={{ position:"absolute", right:18, bottom:108, animation:`fadeUp .22s ${T.spring}` }}>
              <IconButton onClick={() => scrollToBottom(true)} sx={{ width:34, height:34, bgcolor:T.surface, color:T.inkSub, border:`1px solid ${T.borderMed}`, boxShadow:T.shadowMd, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink }, transition:`all .18s ${T.ease}` }}>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize:18 }} />
              </IconButton>
            </Box>
          )}

          <Composer
            userInput={userInput} setUserInput={setUserInput}
            handleSendText={handleSendText}
            recording={recording}
            startRecording={startRecording} stopRecording={stopRecording}
            cancelRecording={cancelRecording}
            isLoading={typing}
            recMs={recMs} vuLevel={vuLevel} uploadProgress={uploadProgress}
            isWolof={isWolof}
          />
        </Box>
      </Box>

      <Snackbar open={Boolean(error)} autoHideDuration={3500} onClose={() => setError("")} anchorOrigin={{ vertical:"top", horizontal:"center" }}>
        <Alert severity="error" onClose={() => setError("")} variant="filled" sx={{ fontFamily:T.font, bgcolor:T.danger, borderRadius:"12px" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

/* ═══════════════════ ATOMS ════════════════════════════════════════ */
function BotAvatar() {
  return (
    <Box sx={{ width:30, height:30, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:`1.5px solid ${T.border}`, alignSelf:"flex-end", mb:0.5, boxShadow:T.shadowXs }}>
      <img src={chatbotMascot} alt="Bot" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
    </Box>
  );
}

function UserAvatar() {
  return (
    <Box sx={{ width:30, height:30, borderRadius:"50%", flexShrink:0, background:`linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`, display:"flex", alignItems:"center", justifyContent:"center", alignSelf:"flex-end", mb:0.5, boxShadow:`0 2px 8px ${PRIMARY_COLOR}40` }}>
      <Typography sx={{ color:"#fff", fontSize:11, fontWeight:700 }}>U</Typography>
    </Box>
  );
}

function MsgRow({ isUser, children }) {
  return (
    <Box sx={{ display:"flex", flexDirection:isUser ? "row-reverse" : "row", alignItems:"flex-end", gap:1, mb:0.75 }}>
      {children}
    </Box>
  );
}

function DayChip({ date }) {
  const label = date.toLocaleDateString(undefined, { weekday:"short", day:"2-digit", month:"short" });
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ my:3 }}>
      <Divider sx={{ flex:1, borderColor:T.border }} />
      <Box sx={{ px:1.5, py:0.375, borderRadius:99, bgcolor:T.surface, border:`1px solid ${T.border}`, boxShadow:T.shadowXs }}>
        <Typography sx={{ fontSize:10, fontWeight:600, color:T.inkMuted, letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
          {label}
        </Typography>
      </Box>
      <Divider sx={{ flex:1, borderColor:T.border }} />
    </Stack>
  );
}

function Bubble({ isUser, children, copyable, copyText="", timestamp }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(copyText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <Tooltip title={new Date(timestamp).toLocaleString()} arrow placement={isUser ? "left" : "right"}>
      <Box sx={{
        position:"relative",
        maxWidth:{ xs:"82%", sm:"70%", md:"62%" },
        px:2, py:1.375, pr:copyable ? 4.5 : 2,
        borderRadius:isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        background:isUser ? `linear-gradient(140deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)` : T.surface,
        border:isUser ? "none" : `1px solid ${T.border}`,
        boxShadow:isUser ? `0 4px 16px ${PRIMARY_COLOR}30, 0 1px 4px rgba(0,0,0,0.08)` : T.shadowSm,
      }}>
        {children}
        <Typography sx={{ fontSize:"10px", mt:0.375, color:isUser ? "rgba(255,255,255,0.45)" : T.inkMuted, textAlign:isUser ? "right" : "left", letterSpacing:"0.02em", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>
          {new Date(timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
        </Typography>
        {copyable && (
          <Tooltip title={copied ? "Copié ✓" : "Copier"} placement="top">
            <IconButton size="small" onClick={copy} sx={{ position:"absolute", top:6, right:5, width:24, height:24, color:copied ? T.success : T.inkMuted, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink }, transition:"color .18s" }}>
              {copied ? <CheckRoundedIcon sx={{ fontSize:12 }} /> : <ContentCopyRoundedIcon sx={{ fontSize:12 }} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Tooltip>
  );
}

/* ═══════════════════ AUDIO PLAYER ════════════════════════════════ */
function fmtTime(s) {
  if (!isFinite(s)) return "--:--";
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
}

function AudioPlayer({ url, isUser, lastRate=1, onRate }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);
  const [anchor, setAnchor] = useState(null);
  const pct = dur ? (cur/dur)*100 : 0;

  useEffect(() => {
    const a = ref.current; if (!a) return;
    a.addEventListener("loadedmetadata", () => setDur(a.duration||0));
    a.addEventListener("timeupdate",     () => setCur(a.currentTime||0));
    a.addEventListener("ended",          () => setPlaying(false));
    a.playbackRate = lastRate;
  }, [lastRate]);

  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else a.play().then(() => setPlaying(true)).catch(() => {});
  };
  const seek = (e) => {
    const a = ref.current; if (!a) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.min(Math.max((e.clientX-r.left)/r.width,0),1)*(a.duration||0);
  };
  const setRate = (r) => { const a = ref.current; if (!a) return; a.playbackRate=r; onRate?.(r); setAnchor(null); };

  const fg=isUser?"rgba(255,255,255,0.95)":T.ink, fgDim=isUser?"rgba(255,255,255,0.40)":T.inkMuted;
  const bar=isUser?"rgba(255,255,255,0.25)":`${PRIMARY_COLOR}22`, barFill=isUser?"rgba(255,255,255,0.90)":PRIMARY_COLOR;
  const btnBg=isUser?"rgba(255,255,255,0.18)":`${PRIMARY_COLOR}14`, btnHov=isUser?"rgba(255,255,255,0.28)":`${PRIMARY_COLOR}22`;

  return (
    <Box sx={{ minWidth:190 }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <IconButton size="small" onClick={toggle} sx={{ width:34, height:34, flexShrink:0, bgcolor:btnBg, color:fg, "&:hover":{ bgcolor:btnHov, transform:"scale(1.06)" }, transition:`all .15s ${T.ease}` }}>
          {playing ? <PauseRoundedIcon sx={{ fontSize:16 }} /> : <PlayArrowRoundedIcon sx={{ fontSize:16 }} />}
        </IconButton>
        <Box sx={{ flex:1 }}>
          <Box onClick={seek} sx={{ height:28, cursor:"pointer", display:"flex", alignItems:"center", gap:"2px" }}>
            {WAVE_H.map((h,i) => (
              <Box key={i} sx={{ flex:1, height:`${h}%`, borderRadius:999, bgcolor:(i/WAVE_H.length)*100<pct?barFill:bar, transition:"background .08s" }} />
            ))}
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mt:"2px" }}>
            <Typography sx={{ fontSize:10, color:fgDim, fontVariantNumeric:"tabular-nums" }}>{fmtTime(cur)}</Typography>
            <Typography sx={{ fontSize:10, color:fgDim, fontVariantNumeric:"tabular-nums" }}>{fmtTime(dur)}</Typography>
          </Stack>
        </Box>
        <Stack spacing={0.25} alignItems="center">
          <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ p:0.5, color:fgDim, "&:hover":{ color:fg } }}>
            <Typography sx={{ fontSize:10, fontWeight:700, lineHeight:1 }}>{lastRate}×</Typography>
          </IconButton>
          <IconButton size="small" component="a" href={url} download sx={{ p:0.5, color:fgDim, "&:hover":{ color:fg } }}>
            <DownloadRoundedIcon sx={{ fontSize:13 }} />
          </IconButton>
        </Stack>
      </Stack>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ sx:{ bgcolor:T.surface, border:`1px solid ${T.border}`, borderRadius:"12px", boxShadow:T.shadowLg, minWidth:72 } }}>
        {PLAYBACK_RATES.map((r) => (
          <MenuItem key={r} onClick={() => setRate(r)} selected={r===lastRate}
            sx={{ fontFamily:T.font, fontSize:13, fontWeight:r===lastRate?700:400, color:r===lastRate?PRIMARY_COLOR:T.inkSub, "&.Mui-selected":{ bgcolor:`${PRIMARY_COLOR}0C` }, py:0.75, "&:hover":{ bgcolor:T.surfaceHov } }}>
            {r}×
          </MenuItem>
        ))}
      </Menu>
      <audio ref={ref} src={url} preload="metadata" />
    </Box>
  );
}

/* ═══════════════════ COMPOSER ═════════════════════════════════════ */
function clock(ms) { const s=Math.floor(ms/1000),m=Math.floor(s/60); return `${m}:${String(s%60).padStart(2,"0")}`; }

function Composer({ userInput, setUserInput, handleSendText, recording, startRecording, stopRecording, isLoading, cancelRecording, recMs, vuLevel, uploadProgress, isWolof }) {
  const remaining = CHAR_LIMIT - userInput.length;
  // En wolof : on désactive le texte et le bouton envoi
  const textDisabled = isLoading || recording || isWolof;
  const canSend = !isLoading && !recording && !isWolof && userInput.trim().length > 0;

  const micTooltip = isWolof
    ? (recording ? "Arrêter" : "Envoyer un message vocal en Wolof")
    : (recording ? "Arrêter" : "Message vocal");

  return (
    <Box sx={{ flexShrink:0, bgcolor:T.surface, borderTop:`1px solid ${T.border}`, px:{ xs:1.5, sm:3, md:"12%", lg:"18%" }, pt:1.375, pb:{ xs:1.75, md:1.5 } }}>

      {recording && (
        <Box sx={{ mb:1.25, px:1.75, py:1, bgcolor:T.canvas, border:`1px solid ${T.border}`, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:T.danger, flexShrink:0, animation:"recRing 1.4s infinite" }} />
            <Typography sx={{ fontFamily:T.font, fontSize:13, fontWeight:600, color:T.ink }}>Enregistrement</Typography>
            <Typography sx={{ fontFamily:T.font, fontSize:12, fontWeight:600, color:T.inkSub, fontVariantNumeric:"tabular-nums" }}>{clock(recMs)}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex:1, minWidth:140, maxWidth:260 }}>
            <VUMeter vu={vuLevel} />
            <IconButton size="small" onClick={cancelRecording} sx={{ width:28, height:28, borderRadius:"8px", flexShrink:0, color:T.inkSub, "&:hover":{ bgcolor:`${T.danger}12`, color:T.danger }, transition:`all .18s ${T.ease}` }}>
              <CloseIcon sx={{ fontSize:14 }} />
            </IconButton>
          </Stack>
        </Box>
      )}

      {uploadProgress !== null && uploadProgress >= 0 && (
        <Box sx={{ mb:1.25, px:1.75, py:1, bgcolor:T.canvas, border:`1px solid ${T.border}`, borderRadius:"12px" }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb:0.625 }}>
            <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:SECONDARY_COLOR, flexShrink:0 }} />
            <Typography sx={{ fontFamily:T.font, fontSize:11.5, color:T.inkSub, flex:1, fontWeight:500 }}>Traitement audio…</Typography>
            <Typography sx={{ fontFamily:T.font, fontSize:11, fontWeight:700, color:PRIMARY_COLOR }}>{uploadProgress}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ height:2, borderRadius:99, bgcolor:T.surfaceHov, "& .MuiLinearProgress-bar":{ bgcolor:PRIMARY_COLOR, borderRadius:99 } }} />
        </Box>
      )}

      <Stack direction="row" alignItems="flex-end" spacing={1}>
        <Tooltip title={micTooltip}>
          <span>
            <IconButton onClick={recording ? stopRecording : startRecording} disabled={isLoading}
              sx={{ width:42, height:42, borderRadius:"13px", flexShrink:0, bgcolor:recording?`${T.danger}10`:isWolof?`${PRIMARY_COLOR}12`:T.canvas, border:`1px solid ${recording?T.danger+"50":isWolof?`${PRIMARY_COLOR}40`:T.borderMed}`, color:recording?T.danger:isWolof?PRIMARY_COLOR:T.inkSub, "&:hover":{ bgcolor:recording?`${T.danger}18`:isWolof?`${PRIMARY_COLOR}20`:T.surfaceHov, color:recording?T.danger:isWolof?PRIMARY_COLOR:T.ink, borderColor:recording?T.danger:isWolof?PRIMARY_COLOR:"rgba(0,0,0,0.22)" }, "&:disabled":{ opacity:0.4 }, transition:`all .18s ${T.ease}` }}>
              {recording ? <StopIcon sx={{ fontSize:18 }} /> : <MicIcon sx={{ fontSize:18 }} />}
            </IconButton>
          </span>
        </Tooltip>

        <Box sx={{ flex:1, display:"flex", alignItems:"flex-end", bgcolor: isWolof ? `${T.canvas}` : T.canvas, border:`1.5px solid ${isWolof ? T.border : T.borderMed}`, borderRadius:"16px", px:1.75, py:0.75, opacity: isWolof ? 0.5 : 1, transition:`border-color .2s ${T.ease},box-shadow .2s ${T.ease},opacity .2s ${T.ease}`, "&:focus-within": isWolof ? {} : { borderColor:`${PRIMARY_COLOR}70`, boxShadow:`0 0 0 3px ${PRIMARY_COLOR}12`, bgcolor:T.surface } }}>
          <TextField fullWidth multiline maxRows={6}
            placeholder={isWolof ? "Mode Wolof — utilisez le micro 🎙️" : "Votre message… (Maj+Entrée pour saut de ligne)"}
            variant="standard" value={userInput}
            onChange={(e) => !isWolof && e.target.value.length <= CHAR_LIMIT && setUserInput(e.target.value)}
            onKeyDown={(e) => { if (!isWolof && e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
            disabled={textDisabled}
            InputProps={{ disableUnderline:true }}
            sx={{ "& .MuiInputBase-root":{ fontFamily:T.font, fontSize:14.5, lineHeight:1.65, color:T.ink, py:0.5 }, "& .MuiInputBase-input::placeholder":{ color:T.inkMuted, opacity:1 }, "& .MuiInputBase-input:disabled":{ WebkitTextFillColor:T.inkMuted } }}
          />
          {!isWolof && remaining < 300 && (
            <Typography sx={{ fontFamily:T.font, fontSize:10, fontWeight:700, alignSelf:"flex-end", mb:0.75, ml:1, flexShrink:0, color:remaining<80?T.danger:T.inkMuted, transition:"color .2s" }}>{remaining}</Typography>
          )}
        </Box>

        <Tooltip title={isWolof ? "Non disponible en mode Wolof" : "Envoyer (Entrée)"}>
          <span>
            <IconButton onClick={() => handleSendText()} disabled={!canSend}
              sx={{ width:42, height:42, borderRadius:"13px", flexShrink:0, bgcolor:canSend?PRIMARY_COLOR:T.canvas, border:`1px solid ${canSend?"transparent":T.borderMed}`, color:canSend?"#fff":T.inkMuted, boxShadow:canSend?`0 4px 14px ${PRIMARY_COLOR}45`:"none", "&:hover":canSend?{ bgcolor:SECONDARY_COLOR, boxShadow:`0 6px 20px ${SECONDARY_COLOR}55`, transform:"translateY(-1px)" }:{}, "&:active":canSend?{ transform:"scale(0.95)", animation:"sendPop .25s ease" }:{}, "&:disabled":{ opacity:0.38 }, transition:`all .2s ${T.spring}` }}>
              {isLoading ? <CircularProgress size={16} sx={{ color:T.inkMuted }} /> : <SendRoundedIcon sx={{ fontSize:17 }} />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Typography sx={{ fontFamily:T.font, fontSize:10, color:T.inkMuted, textAlign:"center", mt:0.875, letterSpacing:"0.02em" }}>
        {isWolof
          ? "Mode Wolof — seulement le micro est disponible"
          : "Entrée pour envoyer · Maj+Entrée pour nouvelle ligne"
        }
      </Typography>
    </Box>
  );
}

function VUMeter({ vu }) {
  return (
    <Stack direction="row" alignItems="center" spacing="2px" sx={{ flex:1, height:16 }}>
      {Array.from({ length:16 }).map((_, i) => {
        const frac=i/16, active=frac<vu;
        return <Box key={i} sx={{ flex:1, height:active?`${25+frac*75}%`:"18%", borderRadius:999, bgcolor:active?(vu>0.75?"#F59E0B":PRIMARY_COLOR):T.borderMed, transition:"height .07s ease,background .12s" }} />;
      })}
    </Stack>
  );
}