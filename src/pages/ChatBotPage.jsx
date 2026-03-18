// ChatBotPage.jsx — SunuChat · Voice-First Light Theme
// Structure vocale immersive identique, thème clair avec palette brand
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Box, Typography, IconButton, Button, TextField,
  CircularProgress, Tooltip, Drawer,
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
import KeyboardRoundedIcon              from "@mui/icons-material/KeyboardRounded";
import GraphicEqRoundedIcon             from "@mui/icons-material/GraphicEqRounded";
import MusicNoteRoundedIcon             from "@mui/icons-material/MusicNoteRounded";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import chatbotMascot from "../assets/icons/mascotteSunuchat.png";
import { useNavigate, useParams } from "react-router-dom";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

/* ── TOKENS — thème clair unifié ─────────────────────────────────── */
const T = {
  // Fonds
  canvas:      "#F4F6FA",
  canvasMid:   "#EEF1F7",          // fond écran d'accueil (légèrement teinté brand)
  surface:     "#FFFFFF",
  surfaceHov:  "#F0F2F6",
  sidebar:     "#FFFFFF",
  header:      "#FFFFFF",
  // Texte
  ink:         "#0F1217",
  inkSub:      "#4E5568",
  inkMuted:    "#9BA5BC",
  inkOnBrand:  "#FFFFFF",
  // Bordures
  border:      "rgba(0,0,0,0.07)",
  borderMed:   "rgba(0,0,0,0.11)",
  // Brand (couleurs de charte)
  brand:       PRIMARY_COLOR,
  brandAlt:    SECONDARY_COLOR,
  // Couleur micro = PRIMARY_COLOR (pas de violet fixe)
  micLight:    `${PRIMARY_COLOR}12`,
  micBorder:   `${PRIMARY_COLOR}30`,
  micGlow:     `${PRIMARY_COLOR}55`,
  // Sémantiques
  danger:      "#E03140",
  success:     "#1AB57A",
  // Typo & animations
  font:        "'DM Sans','Helvetica Neue',sans-serif",
  ease:        "cubic-bezier(0.25,0.46,0.45,0.94)",
  spring:      "cubic-bezier(0.34,1.56,0.64,1)",
  shadowXs:    "0 1px 3px rgba(0,0,0,0.06)",
  shadowSm:    "0 4px 14px rgba(0,0,0,0.07)",
  shadowMd:    "0 8px 28px rgba(0,0,0,0.09)",
  shadowLg:    "0 20px 48px rgba(0,0,0,0.11)",
};

const CHAR_LIMIT     = 1800;
const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];
const WAVE_H = [30,55,75,90,60,80,40,70,55,95,65,45,85,55,70,35,88,62,78,50,68,42,82,58];
const API = process.env.REACT_APP_BACK_URL;

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

/* ── LANG SELECTOR ───────────────────────────────────────────────── */
function LangSelector({ lang, setLang }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}
      sx={{ bgcolor: T.canvas, border: `1px solid ${T.borderMed}`, borderRadius: "10px", p: "3px", flexShrink: 0 }}>
      {[{ code:"fr", flag:"🇫🇷", label:"Français" }, { code:"wo", flag:"🇸🇳", label:"Wolof" }].map((l) => {
        const active = lang === l.code;
        return (
          <Box key={l.code} onClick={() => setLang(l.code)} sx={{
            display:"flex", alignItems:"center", gap:"5px", px:1, py:0.5, borderRadius:"7px", cursor:"pointer",
            bgcolor: active ? PRIMARY_COLOR : "transparent",
            boxShadow: active ? `0 2px 8px ${T.micGlow}` : "none",
            border: active ? `1px solid transparent` : "1px solid transparent",
            transition: `all .18s ${T.ease}`,
            "&:hover": active ? {} : { bgcolor: T.surfaceHov },
          }}>
            <Typography sx={{ fontSize:13 }}>{l.flag}</Typography>
            <Typography sx={{ fontFamily:T.font, fontSize:11.5, fontWeight:active?700:500, color:active?T.inkOnBrand:T.inkSub, lineHeight:1, display:{ xs:"none", sm:"block" } }}>{l.label}</Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

/* ═══════════════════════ SIDEBAR ══════════════════════════════════ */
function Sidebar({ conversations, setConversations, selectedId, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuAnchor, setMenuAnchor]         = useState(null);
  const [menuConvId, setMenuConvId]         = useState(null);
  const [renamingId, setRenamingId]         = useState(null);
  const [renameVal,  setRenameVal]          = useState("");
  const [deleteDialogId, setDeleteDialogId] = useState(null);

  const openMenu  = (e, id) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuConvId(id); };
  const closeMenu = () => { setMenuAnchor(null); setMenuConvId(null); };
  const askDelete = (id) => { setMenuAnchor(null); setMenuConvId(null); setTimeout(() => setDeleteDialogId(id), 80); };

  const confirmDelete = async () => {
    const id = deleteDialogId; setDeleteDialogId(null);
    try {
      await axios.delete(`${API}/conversations/${id}`, { headers:{ Authorization:`Bearer ${token}` } });
      setConversations((p) => p.filter((c) => c._id !== id));
      if (selectedId === id) navigate("/chatbot");
    } catch {}
  };

  const startRename = (id, current) => {
    setMenuAnchor(null); setMenuConvId(null); setRenameVal(current || "");
    setTimeout(() => setRenamingId(id), 120);
  };

  const commitRename = async (id) => {
    const title = renameVal.trim(); if (!title) { setRenamingId(null); return; }
    try {
      await axios.patch(`${API}/conversations/${id}/rename`, { title }, { headers:{ Authorization:`Bearer ${token}` } });
      setConversations((p) => p.map((c) => c._id === id ? { ...c, title } : c));
    } catch {}
    setRenamingId(null);
  };

  return (
    <Box sx={{ display:"flex", flexDirection:"column", height:"100%", bgcolor:T.sidebar }}>
      <Box sx={{ px:2, pt:2.5, pb:1.75, borderBottom:`1px solid ${T.border}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.75}>
          <Typography sx={{ fontFamily:T.font, fontWeight:700, fontSize:"0.9rem", color:T.ink, letterSpacing:"-0.01em" }}>Conversations</Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ color:T.inkMuted, borderRadius:"7px", "&:hover":{ bgcolor:T.surfaceHov, color:T.ink } }}>
              <CloseIcon sx={{ fontSize:15 }}/>
            </IconButton>
          )}
        </Stack>
        <Button fullWidth variant="outlined" startIcon={<AddRoundedIcon sx={{ fontSize:15 }}/>}
          onClick={() => { navigate("/chatbot"); onClose?.(); }} disableElevation
          sx={{ fontFamily:T.font, fontWeight:600, fontSize:"0.8rem", textTransform:"none", borderRadius:"10px", py:0.875, borderColor:T.borderMed, color:T.inkSub, "&:hover":{ borderColor:PRIMARY_COLOR, color:PRIMARY_COLOR, bgcolor:`${PRIMARY_COLOR}07` }, transition:`all .18s ${T.ease}` }}>
          Nouvelle conversation
        </Button>
      </Box>

      <Box sx={{ flex:1, overflowY:"auto", px:1.25, py:1.25, "&::-webkit-scrollbar":{ width:3 }, "&::-webkit-scrollbar-thumb":{ bgcolor:"rgba(0,0,0,0.08)", borderRadius:4 } }}>
        {conversations.length === 0 && (
          <Box sx={{ textAlign:"center", pt:4, px:2 }}>
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize:26, color:T.inkMuted, mb:1 }}/>
            <Typography sx={{ fontFamily:T.font, fontSize:"0.8rem", color:T.inkMuted, lineHeight:1.6 }}>Aucune conversation enregistrée</Typography>
          </Box>
        )}
        {conversations.map((conv) => {
          const isSelected = conv._id === selectedId;
          const isRenaming = renamingId === conv._id;
          return (
            <Box key={conv._id} onClick={() => { if (!isRenaming) { navigate(`/chatbot/conv/${conv._id}`); onClose?.(); } }}
              sx={{ position:"relative", px:1.375, py:1, borderRadius:"10px", mb:0.25, cursor:isRenaming?"default":"pointer", bgcolor:isSelected?`${PRIMARY_COLOR}0D`:"transparent", border:`1px solid ${isSelected?`${PRIMARY_COLOR}25`:"transparent"}`, transition:`all .15s ${T.ease}`, "&:hover":isRenaming?{}:{ bgcolor:isSelected?`${PRIMARY_COLOR}0D`:T.surfaceHov, "& .conv-menu-btn":{ opacity:1 } }, "& .conv-menu-btn":{ opacity:isSelected?1:0, transition:"opacity .15s" } }}>
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <ChatBubbleOutlineRoundedIcon sx={{ fontSize:13, flexShrink:0, mt:"1px", color:isSelected?PRIMARY_COLOR:T.inkMuted }}/>
                <Box sx={{ flex:1, minWidth:0 }}>
                  {isRenaming ? (
                    <TextField autoFocus size="small" value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                      onKeyDown={(e) => { if (e.key==="Enter") commitRename(conv._id); if (e.key==="Escape") setRenamingId(null); }}
                      onBlur={() => setTimeout(() => commitRename(conv._id), 150)} onClick={(e) => e.stopPropagation()}
                      variant="standard" InputProps={{ disableUnderline:false }}
                      sx={{ width:"100%", "& .MuiInputBase-input":{ fontFamily:T.font, fontSize:"0.82rem", color:T.ink, py:"2px" }, "& .MuiInput-underline:after":{ borderBottomColor:PRIMARY_COLOR } }}/>
                  ) : (
                    <Typography sx={{ fontFamily:T.font, fontSize:"0.82rem", fontWeight:isSelected?600:400, color:isSelected?T.ink:T.inkSub, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {conv.title || "Nouvelle conversation"}
                    </Typography>
                  )}
                </Box>
                {!isRenaming && (
                  <IconButton className="conv-menu-btn" size="small" onClick={(e) => openMenu(e, conv._id)}
                    sx={{ width:22, height:22, borderRadius:"6px", flexShrink:0, color:T.inkMuted, "&:hover":{ bgcolor:T.borderMed, color:T.ink } }}>
                    <MoreHorizRoundedIcon sx={{ fontSize:14 }}/>
                  </IconButton>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}
        PaperProps={{ elevation:0, sx:{ bgcolor:T.surface, border:`1px solid ${T.border}`, borderRadius:"12px", boxShadow:T.shadowLg, minWidth:172, py:0.5 } }}
        transformOrigin={{ horizontal:"right", vertical:"top" }} anchorOrigin={{ horizontal:"right", vertical:"bottom" }}>
        <MenuItem onClick={() => { const id=menuConvId; const conv=conversations.find((c)=>c._id===id); startRename(id, conv?.title); }}
          sx={{ fontFamily:T.font, fontSize:"0.84rem", color:T.inkSub, gap:1.25, px:1.75, py:1, borderRadius:"8px", mx:0.5, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink } }}>
          <DriveFileRenameOutlineRoundedIcon sx={{ fontSize:16 }}/> Renommer
        </MenuItem>
        <Divider sx={{ my:0.5, mx:1.75, borderColor:T.border }}/>
        <MenuItem onClick={() => askDelete(menuConvId)}
          sx={{ fontFamily:T.font, fontSize:"0.84rem", color:T.danger, gap:1.25, px:1.75, py:1, borderRadius:"8px", mx:0.5, "&:hover":{ bgcolor:"rgba(224,49,64,0.07)" } }}>
          <DeleteOutlineRoundedIcon sx={{ fontSize:16 }}/> Supprimer
        </MenuItem>
      </Menu>

      <Dialog open={Boolean(deleteDialogId)} onClose={() => setDeleteDialogId(null)}
        PaperProps={{ sx:{ borderRadius:"16px", boxShadow:T.shadowLg, border:`1px solid ${T.border}`, minWidth:300, p:0.5 } }}>
        <DialogTitle sx={{ fontFamily:T.font, fontWeight:700, fontSize:"1rem", color:T.ink, pb:0.5 }}>Supprimer la conversation ?</DialogTitle>
        <DialogContent><Typography sx={{ fontFamily:T.font, fontSize:"0.875rem", color:T.inkSub, lineHeight:1.6 }}>Cette action est irréversible.</Typography></DialogContent>
        <DialogActions sx={{ px:2.5, pb:2, gap:1 }}>
          <Button onClick={() => setDeleteDialogId(null)} sx={{ fontFamily:T.font, fontWeight:600, fontSize:"0.82rem", textTransform:"none", borderRadius:"10px", px:2, py:0.75, color:T.inkSub, border:`1px solid ${T.borderMed}`, "&:hover":{ bgcolor:T.surfaceHov } }}>Annuler</Button>
          <Button onClick={confirmDelete} sx={{ fontFamily:T.font, fontWeight:600, fontSize:"0.82rem", textTransform:"none", borderRadius:"10px", px:2, py:0.75, bgcolor:T.danger, color:"#fff", "&:hover":{ bgcolor:"#c0272f" } }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ═══════════════════════ PAGE ══════════════════════════════════════ */
export default function ChatBotPage() {
  const [chat, setChat]           = useState([]);
  const [recording, setRecording] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [error, setError]         = useState("");
  const [offline, setOffline]     = useState(!navigator.onLine);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [lastRate, setLastRate]   = useState(() => Number(localStorage.getItem("sunuchat_rate") || 1));
  const [typing, setTyping]       = useState(false);
  const [ephemere, setEphemere]   = useState(false);
  const [lang, setLang]           = useState("fr");
  const [showText, setShowText]   = useState(false);

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

  const navigate    = useNavigate();
  const { id: convId } = useParams();
  const token       = localStorage.getItem("token");
  const isConn      = !!token;
  const isMd        = useMediaQuery("(min-width:900px)");
  const isWolof     = lang === "wo";
  const hasChat     = chat.length > 0;
  const textMode    = !isWolof && showText && !recording;

  const prompts = useMemo(() => [
    { label:"Symptômes de la dengue ?",           icon:"🦟" },
    { label:"Prévenir le paludisme en wolof",      icon:"🌿" },
    { label:"Fièvre enfant 3 jours — que faire ?", icon:"🌡️" },
    { label:"Quand aller au poste de santé ?",     icon:"🏥" },
  ], []);

  const scrollToBottom = useCallback((s=true) => bottomRef.current?.scrollIntoView({ behavior:s?"smooth":"auto" }), []);

  useEffect(() => { if (isMd && isConn) setSidebarOpen(true); }, [isMd, isConn]);
  useEffect(() => {
    const el = listRef.current; if (!el) return;
    const fn = () => setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 180);
    el.addEventListener("scroll", fn, { passive:true });
    return () => el.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { scrollToBottom(true); }, [chat, typing]);
  useEffect(() => {
    const on=()=>setOffline(false), off=()=>setOffline(true);
    window.addEventListener("online",on); window.addEventListener("offline",off);
    return () => { window.removeEventListener("online",on); window.removeEventListener("offline",off); };
  }, []);
  useEffect(() => {
    if (!convId) { setChat([]); return; }
    (async () => {
      try {
        const r = await axios.get(`${API}/conversations/${convId}`, { headers:{ Authorization:`Bearer ${token}` } });
        setChat(r.data.messages.map((m) => ({ sender:m.sender, message_type:m.message_type, content:m.content, audio_path:m.audio_path, timestamp:m.timestamp })));
      } catch { setError("Impossible de charger la conversation."); }
    })();
  }, [convId]);
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const r = await axios.get(`${API}/conversations`, { headers:{ Authorization:`Bearer ${token}` } });
        setConversations(r.data);
      } catch {}
    })();
  }, [convId]);

  /* ── recording ── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(stream);
      mediaRecRef.current=mr; streamRef.current=stream; chunksRef.current=[];
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize=1024;
      const src = ctx.createMediaStreamSource(stream); src.connect(an);
      ctxRef.current=ctx; analyserRef.current=an; srcRef.current=src;
      const buf = new Uint8Array(an.frequencyBinCount);
      const loop = () => {
        an.getByteTimeDomainData(buf);
        let p=0; for (let i=0;i<buf.length;i++) p=Math.max(p,Math.abs((buf[i]-128)/128));
        setVuLevel(p); rafRef.current=requestAnimationFrame(loop);
      };
      loop();
      mr.ondataavailable=(e)=>{ if(e.data.size>0) chunksRef.current.push(e.data); };
      mr.start(); setRecording(true); setRecMs(0);
      timerRef.current=setInterval(()=>setRecMs((t)=>t+100),100);
    } catch { setError("Micro non accessible. Vérifiez les permissions."); }
  };

  const cleanAudio = () => {
    cancelAnimationFrame(rafRef.current);
    try { srcRef.current?.disconnect(); } catch {}
    try { analyserRef.current?.disconnect(); } catch {}
    try { ctxRef.current?.close(); } catch {}
  };

  const stopRecording = () => {
    const capturedLang = lang;
    const mr = mediaRecRef.current; if (!mr) return;
    streamRef.current?.getTracks().forEach((t)=>t.stop());
    setRecording(false); clearInterval(timerRef.current); cleanAudio();
    mr.onstop = () => handleSendAudio(capturedLang);
    mr.stop();
  };

  const cancelRecording = () => {
    const mr = mediaRecRef.current; if (mr) mr.onstop=null;
    mr?.stop(); streamRef.current?.getTracks().forEach((t)=>t.stop());
    setRecording(false); clearInterval(timerRef.current); cleanAudio();
  };

  const beginWait = () => {
    pendingRef.current+=1;
    if (delayRef.current) clearTimeout(delayRef.current);
    delayRef.current=setTimeout(()=>{ if(pendingRef.current>0) setTyping(true); },250);
  };
  const endWait = () => {
    pendingRef.current=Math.max(0,pendingRef.current-1);
    if (pendingRef.current===0) { clearTimeout(delayRef.current); setTyping(false); }
  };

  const handleSendAudio = async (selectedLang) => {
    const blob = new Blob(chunksRef.current, { type:"audio/webm" });
    const ts = new Date().toISOString();
    setChat((p)=>[...p,{ sender:"user",message_type:"audio",content:"Audio envoyé",audio_path:URL.createObjectURL(blob),timestamp:ts }]);
    setUploadProgress(5); beginWait();
    try {
      const fd=new FormData(); fd.append("audio",blob);
      const up = await axios.post(`${API}/upload_audio`,fd,{ onUploadProgress:(e)=>e.total&&setUploadProgress(Math.max(5,Math.round(e.loaded/e.total*100))) });
      const uMsg={sender:"user",message_type:"audio",content:"Audio envoyé",audio_path:up.data.audio_url,timestamp:ts};
      const mkFd=()=>{ const f=new FormData(); f.append("audio",new Blob(chunksRef.current,{type:"audio/webm"})); f.append("lang",selectedLang); return f; };
      if (isConn&&!convId&&!ephemere) {
        const res=await axios.post(`${API}/conversations/first-message`,uMsg,{ headers:{ Authorization:`Bearer ${token}` } });
        const nid=res.data.conversation_id;
        const br=await axios.post(`${API}/chatbot`,mkFd());
        const bMsg={sender:"bot",message_type:"audio",content:br.data.text,audio_path:br.data.audio_url,timestamp:new Date().toISOString()};
        setChat((p)=>[...p,bMsg]);
        await axios.post(`${API}/conversations/${nid}/message`,bMsg,{ headers:{ Authorization:`Bearer ${token}` } });
        navigate(`/chatbot/conv/${nid}`);
      } else if (isConn&&convId&&!ephemere) {
        await axios.post(`${API}/conversations/${convId}/message`,uMsg,{ headers:{ Authorization:`Bearer ${token}` } });
        const br=await axios.post(`${API}/chatbot`,mkFd());
        const bMsg={sender:"bot",message_type:"audio",content:br.data.text,audio_path:br.data.audio_url,timestamp:new Date().toISOString()};
        setChat((p)=>[...p,bMsg]);
        await axios.post(`${API}/conversations/${convId}/message`,bMsg,{ headers:{ Authorization:`Bearer ${token}` } });
      } else {
        const br=await axios.post(`${API}/chatbot`,mkFd());
        setChat((p)=>[...p,{ sender:"bot",message_type:"audio",content:br.data.text,audio_path:br.data.audio_url,timestamp:new Date().toISOString() }]);
      }
    } catch { setError("Échec de l'envoi de l'audio."); }
    finally { endWait(); setTimeout(()=>setUploadProgress(null),400); }
  };

  const handleSendText = async (forced) => {
    if (isWolof) return;
    const text = typeof forced==="string" ? forced : userInput.trim();
    if (!text) return;
    const uMsg={sender:"user",message_type:"text",content:text,audio_path:null,timestamp:new Date().toISOString()};
    setChat((p)=>[...p,uMsg]); setUserInput(""); beginWait();
    try {
      const res=await axios.post(`${API}/chatbotext`,{ text });
      const bMsg={sender:"bot",message_type:"text",content:res.data.reponse,audio_path:null,timestamp:new Date().toISOString()};
      setChat((p)=>[...p,bMsg]);
      if (isConn&&!ephemere) {
        if (!convId) {
          const r=await axios.post(`${API}/conversations/first-message`,uMsg,{ headers:{ Authorization:`Bearer ${token}` } });
          await axios.post(`${API}/conversations/${r.data.conversation_id}/message`,bMsg,{ headers:{ Authorization:`Bearer ${token}` } });
          navigate(`/chatbot/conv/${r.data.conversation_id}`);
        } else {
          await axios.post(`${API}/conversations/${convId}/message`,uMsg,{ headers:{ Authorization:`Bearer ${token}` } });
          await axios.post(`${API}/conversations/${convId}/message`,bMsg,{ headers:{ Authorization:`Bearer ${token}` } });
        }
      }
    } catch { setError("Message non envoyé. Réessayez."); }
    finally { endWait(); }
  };

  const renderMsg = (m,i,prev) => {
    const today   = new Date(m.timestamp).toDateString();
    const prevDay = prev ? new Date(prev.timestamp).toDateString() : null;
    const isUser  = m.sender==="user";
    const isAudio = m.message_type==="audio";
    return (
      <CSSTransition key={i} timeout={360} classNames="msg">
        <Box>
          {today!==prevDay && <DayChip date={new Date(m.timestamp)} />}
          <MsgRow isUser={isUser}>
            {!isUser && <BotAvatar />}
            <VoiceBubble isUser={isUser} isAudio={isAudio} timestamp={m.timestamp} copyable={!isUser&&!isAudio} copyText={m.content??""}>
              {isAudio
                ? <AudioPlayer url={m.audio_path} isUser={isUser} lastRate={lastRate} onRate={(r)=>{ setLastRate(r); localStorage.setItem("sunuchat_rate",String(r)); }}/>
                : <Typography sx={{ fontFamily:T.font, color:isUser?T.inkOnBrand:T.ink, fontWeight:400, fontSize:14.5, lineHeight:1.72, whiteSpace:"pre-wrap", letterSpacing:"0.005em" }}>{m.content}</Typography>
              }
            </VoiceBubble>
            {isUser && <UserAvatar />}
          </MsgRow>
        </Box>
      </CSSTransition>
    );
  };

  const showDesktopSidebar = isConn && sidebarOpen && isMd;
  const clk = (ms) => { const s=Math.floor(ms/1000),m=Math.floor(s/60); return `${m}:${String(s%60).padStart(2,"0")}`; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; }
        .msg-enter        { opacity:0; transform:translateY(10px) scale(0.97); }
        .msg-enter-active { opacity:1; transform:none; transition:opacity 280ms ease,transform 340ms cubic-bezier(0.34,1.56,0.64,1); }
        .msg-exit         { opacity:1; }
        .msg-exit-active  { opacity:0; transition:opacity 140ms ease; }
        .chat-list::-webkit-scrollbar       { width:4px; }
        .chat-list::-webkit-scrollbar-track { background:transparent; }
        .chat-list::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.10); border-radius:4px; }

        @keyframes tdot     { 0%,80%,100%{transform:translateY(0);opacity:.3} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes audioWave{ 0%,100%{transform:scaleY(.2)} 50%{transform:scaleY(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes onlineDot{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
        @keyframes sendPop  { 0%{transform:scale(1)} 50%{transform:scale(1.12)} 100%{transform:scale(1)} }
        @keyframes recDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
      `}</style>

      <Box sx={{ display:"flex", height:"100vh", overflow:"hidden", bgcolor:T.canvas, fontFamily:T.font }}>

        {showDesktopSidebar && (
          <Box sx={{ width:268, flexShrink:0, bgcolor:T.sidebar, borderRight:`1px solid ${T.border}`, boxShadow:"1px 0 0 0 rgba(0,0,0,0.04)" }}>
            <Sidebar conversations={conversations} setConversations={setConversations} selectedId={convId}/>
          </Box>
        )}
        <Drawer anchor="left" open={sidebarOpen&&!isMd} onClose={()=>setSidebarOpen(false)}
          sx={{ display:{ xs:"block", md:"none" }, "& .MuiDrawer-paper":{ width:280, bgcolor:T.sidebar, border:"none", boxShadow:T.shadowLg } }}>
          <Sidebar conversations={conversations} setConversations={setConversations} selectedId={convId} onClose={()=>setSidebarOpen(false)}/>
        </Drawer>

        <Box sx={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, minHeight:0, position:"relative" }}>

          {/* ══ HEADER ══════════════════════════════════════════════ */}
          <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", px:{ xs:1.5, md:2.5 }, height:60, bgcolor:T.header, borderBottom:`1px solid ${T.border}`, flexShrink:0, zIndex:20 }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Tooltip title={isConn?"Menu":"Retour"} arrow>
                <IconButton onClick={()=>isConn?setSidebarOpen((p)=>!p):navigate("/")} size="small"
                  sx={{ color:T.inkSub, borderRadius:2, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink } }}>
                  {isConn?<MenuRoundedIcon sx={{ fontSize:20 }}/>:<ArrowBackRoundedIcon sx={{ fontSize:20 }}/>}
                </IconButton>
              </Tooltip>
              <Tooltip title="Accueil" arrow>
                <IconButton onClick={()=>navigate("/")} size="small" sx={{ color:T.inkSub, borderRadius:2, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink } }}>
                  <HomeRoundedIcon sx={{ fontSize:20 }}/>
                </IconButton>
              </Tooltip>

              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box sx={{ position:"relative", flexShrink:0 }}>
                  <Box sx={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", border:`2px solid ${T.border}`, boxShadow:`0 0 0 2px ${PRIMARY_COLOR}22` }}>
                    <img src={chatbotMascot} alt="SunuChat" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </Box>
                  <Box sx={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", bgcolor:T.success, border:`2px solid ${T.header}`, animation:"onlineDot 2.8s ease infinite" }}/>
                </Box>
                <Box sx={{ lineHeight:1 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb:"2px" }}>
                    <Typography sx={{ fontFamily:T.font, fontWeight:700, fontSize:14, color:T.ink, letterSpacing:"-0.01em", lineHeight:1 }}>SunuChat</Typography>
                    {/* Badge Vocal IA — visible dès l'arrivée */}
                    <Box sx={{ display:"flex", alignItems:"center", gap:"3px", px:0.875, py:"3px", borderRadius:99, bgcolor:`${PRIMARY_COLOR}12`, border:`1px solid ${PRIMARY_COLOR}30` }}>
                      <GraphicEqRoundedIcon sx={{ fontSize:10, color:PRIMARY_COLOR }}/>
                      <Typography sx={{ fontSize:8.5, fontWeight:700, color:PRIMARY_COLOR, letterSpacing:"0.07em", textTransform:"uppercase" }}>Vocal IA</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ fontSize:11, color:T.inkMuted, fontWeight:400, lineHeight:1 }}>
                    {isWolof ? "🇸🇳 Wolof · audio seulement" : "Wolof · Français · Audio & Texte"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
              <LangSelector lang={lang} setLang={setLang}/>
              {isConn ? (
                <>
                  <Stack direction="row" alignItems="center" spacing={0.875} sx={{ display:{ xs:"none", sm:"flex" } }}>
                    <Typography sx={{ fontSize:11.5, fontWeight:500, color:T.inkSub }}>Éphémère</Typography>
                    <PillSwitch checked={ephemere} onChange={()=>{ if(!ephemere) navigate("/chatbot"); setEphemere((p)=>!p); }}/>
                  </Stack>
                  <Button size="small" onClick={()=>{ localStorage.removeItem("token"); navigate("/chatbot"); }}
                    sx={{ fontFamily:T.font, fontWeight:600, fontSize:12, textTransform:"none", color:T.inkSub, border:`1px solid ${T.borderMed}`, borderRadius:"10px", px:1.75, py:0.6, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink, borderColor:"rgba(0,0,0,0.18)" }, transition:`all .18s ${T.ease}` }}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button size="small" onClick={()=>navigate("/login")}
                  sx={{ fontFamily:T.font, fontWeight:600, fontSize:12, textTransform:"none", color:"#fff", bgcolor:PRIMARY_COLOR, borderRadius:"10px", px:1.75, py:0.6, boxShadow:`0 4px 12px ${PRIMARY_COLOR}40`, "&:hover":{ bgcolor:SECONDARY_COLOR }, transition:`all .18s ${T.ease}` }}>
                  Connexion
                </Button>
              )}
            </Stack>
          </Box>

          {offline && (
            <Box sx={{ px:2.5, py:0.75, bgcolor:"#FFFBEB", borderBottom:"1px solid #FDE68A", display:"flex", alignItems:"center", gap:1 }}>
              <WifiOffRoundedIcon sx={{ fontSize:14, color:"#D97706" }}/>
              <Typography sx={{ fontFamily:T.font, fontSize:12, fontWeight:500, color:"#92400E" }}>Hors-ligne — les réponses peuvent être indisponibles</Typography>
            </Box>
          )}

          {/* ══ ZONE PRINCIPALE ════════════════════════════════════ */}
          {!hasChat && !recording ? (
            /* ─────────────────────────────────────────────────────
               ÉCRAN D'ACCUEIL — fond clair teinté brand, micro héros
               Structure identique au dark mais avec la palette brand
            ──────────────────────────────────────────────────────── */
            <Box sx={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              // Fond clair avec gradient brand subtil — garde la sensation "spéciale"
              background:`radial-gradient(ellipse 90% 70% at 50% 45%, ${PRIMARY_COLOR}0A 0%, ${T.canvas} 65%)`,
              position:"relative", overflow:"hidden", pb:4,
            }}>
              {/* Grille de points brand subtile */}
              <Box sx={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle, ${PRIMARY_COLOR}18 1px, transparent 1px)`, backgroundSize:"32px 32px", pointerEvents:"none" }}/>

              {/* Avatar */}
              <Box sx={{ position:"relative", width:72, height:72, mb:3.5, animation:"fadeUp .4s ease both" }}>
                <Box sx={{ position:"absolute", inset:-3, borderRadius:"50%", background:`conic-gradient(from 0deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR}, ${PRIMARY_COLOR}50, ${SECONDARY_COLOR}, ${PRIMARY_COLOR})`, animation:"spin 6s linear infinite", opacity:0.7 }}/>
                <Box sx={{ position:"absolute", inset:2, borderRadius:"50%", bgcolor:T.canvas }}/>
                <Box sx={{ position:"absolute", inset:4, borderRadius:"50%", overflow:"hidden" }}>
                  <img src={chatbotMascot} alt="SunuChat" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </Box>
              </Box>

              <Typography sx={{ fontFamily:T.font, fontWeight:700, fontSize:{ xs:"1.5rem", md:"1.75rem" }, color:T.ink, letterSpacing:"-0.02em", mb:0.75, animation:"fadeUp .4s .05s ease both", opacity:0 }}>
                {isWolof ? "Parlez en Wolof" : "Posez votre question"}
              </Typography>
              <Typography sx={{ fontSize:14, color:T.inkSub, lineHeight:1.7, mb:5.5, maxWidth:320, textAlign:"center", animation:"fadeUp .4s .1s ease both", opacity:0 }}>
                {isWolof
                  ? "Assistant santé vocal en wolof — appuyez sur le micro et parlez."
                  : "Assistant santé multilingue — parlez en français ou en wolof."
                }
              </Typography>

              {/* ── BOUTON MICRO HÉROS ── */}
              <Box sx={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", mb:3.5, animation:"fadeUp .4s .15s ease both", opacity:0 }}>
                {/* 3 anneaux pulse brand */}
                <Box sx={{ position:"absolute", width:150, height:150, borderRadius:"50%", animation:`ring3 2s .6s ease infinite`, pointerEvents:"none",
                  "@keyframes ring3":{ "0%":{ boxShadow:`0 0 0 0 ${PRIMARY_COLOR}10` }, "70%":{ boxShadow:`0 0 0 64px rgba(0,0,0,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(0,0,0,0)` } } }}/>
                <Box sx={{ position:"absolute", width:116, height:116, borderRadius:"50%", animation:`ring2 2s .3s ease infinite`, pointerEvents:"none",
                  "@keyframes ring2":{ "0%":{ boxShadow:`0 0 0 0 ${PRIMARY_COLOR}22` }, "70%":{ boxShadow:`0 0 0 42px rgba(0,0,0,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(0,0,0,0)` } } }}/>
                <Box sx={{ position:"absolute", width:86, height:86, borderRadius:"50%", animation:`ring1 2s ease infinite`, pointerEvents:"none",
                  "@keyframes ring1":{ "0%":{ boxShadow:`0 0 0 0 ${PRIMARY_COLOR}40` }, "70%":{ boxShadow:`0 0 0 22px rgba(0,0,0,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(0,0,0,0)` } } }}/>

                <IconButton onClick={startRecording} disabled={typing}
                  sx={{ width:76, height:76, borderRadius:"50%",
                    background:`linear-gradient(145deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                    color:"#fff", position:"relative", zIndex:1,
                    boxShadow:`0 8px 32px ${PRIMARY_COLOR}55`,
                    "&:hover":{ transform:"scale(1.07)", boxShadow:`0 12px 40px ${PRIMARY_COLOR}70` },
                    "&:active":{ transform:"scale(0.93)" },
                    "&:disabled":{ opacity:0.4 },
                    transition:`all .22s ${T.spring}`,
                  }}>
                  <MicIcon sx={{ fontSize:34 }}/>
                </IconButton>
              </Box>

              <Typography sx={{ fontFamily:T.font, fontSize:13, fontWeight:600, color:PRIMARY_COLOR, letterSpacing:"0.06em", mb:1, animation:"fadeUp .4s .2s ease both", opacity:0 }}>
                {isWolof ? "🇸🇳 Appuyer pour parler en wolof" : "🎙 Appuyer pour parler"}
              </Typography>

              {/* Option texte — fr uniquement, discrète */}
              {!isWolof && (
                <Box onClick={()=>setShowText(true)} sx={{ mt:3, display:"inline-flex", alignItems:"center", gap:0.75, cursor:"pointer", px:1.75, py:0.75, borderRadius:99, border:`1px solid ${T.borderMed}`, color:T.inkMuted, bgcolor:T.surface, animation:"fadeUp .4s .25s ease both", opacity:0, transition:`all .18s ${T.ease}`, "&:hover":{ bgcolor:T.surfaceHov, color:T.inkSub, borderColor:`${PRIMARY_COLOR}40` } }}>
                  <KeyboardRoundedIcon sx={{ fontSize:14 }}/>
                  <Typography sx={{ fontFamily:T.font, fontSize:12 }}>Écrire à la place</Typography>
                </Box>
              )}

              {/* Champ texte opt-in */}
              {showText && !isWolof && (
                <Box sx={{ mt:3.5, width:"100%", maxWidth:480, px:2, animation:"fadeUp .3s ease both" }}>
                  <Stack direction="row" alignItems="flex-end" spacing={1}>
                    <Box sx={{ flex:1, bgcolor:T.surface, border:`1.5px solid ${T.borderMed}`, borderRadius:"16px", px:1.75, py:0.75, transition:`border-color .2s`, "&:focus-within":{ borderColor:`${PRIMARY_COLOR}70`, boxShadow:`0 0 0 3px ${PRIMARY_COLOR}12`, bgcolor:T.surface } }}>
                      <TextField fullWidth multiline maxRows={4} placeholder="Votre message…"
                        variant="standard" value={userInput}
                        onChange={(e)=>e.target.value.length<=CHAR_LIMIT&&setUserInput(e.target.value)}
                        onKeyDown={(e)=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleSendText(); } }}
                        disabled={typing} InputProps={{ disableUnderline:true }}
                        sx={{ "& .MuiInputBase-root":{ fontFamily:T.font, fontSize:14.5, color:T.ink, py:0.5 }, "& .MuiInputBase-input::placeholder":{ color:T.inkMuted, opacity:1 } }}
                      />
                    </Box>
                    <Tooltip title="Envoyer">
                      <span>
                        <IconButton onClick={()=>handleSendText()} disabled={typing||!userInput.trim()}
                          sx={{ width:44, height:44, borderRadius:"13px", flexShrink:0, bgcolor:userInput.trim()&&!typing?PRIMARY_COLOR:T.canvas, border:`1px solid ${userInput.trim()&&!typing?"transparent":T.borderMed}`, color:userInput.trim()&&!typing?"#fff":T.inkMuted, boxShadow:userInput.trim()&&!typing?`0 4px 14px ${PRIMARY_COLOR}45`:"none", "&:hover":userInput.trim()&&!typing?{ bgcolor:SECONDARY_COLOR }:{}, "&:disabled":{ opacity:0.38 }, transition:`all .2s ${T.spring}` }}>
                          {typing?<CircularProgress size={16} sx={{ color:T.inkMuted }}/>:<SendRoundedIcon sx={{ fontSize:17 }}/>}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Box>
              )}

              {/* Suggestions — fr + texte opt-in */}
              {showText && !isWolof && (
                <Box sx={{ display:"flex", flexDirection:"column", gap:1, mt:2, width:"100%", maxWidth:480, px:2, animation:"fadeUp .3s .1s ease both" }}>
                  {prompts.map((p,idx)=>(
                    <Box key={p.label} onClick={()=>handleSendText(p.label)} sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:1.5, px:2, py:1.25, bgcolor:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", cursor:"pointer", boxShadow:T.shadowXs, animation:`fadeUp .3s ${.05+idx*.06}s ease both`, opacity:0, transition:`all .18s ${T.ease}`, "&:hover":{ borderColor:`${PRIMARY_COLOR}50`, boxShadow:`${T.shadowSm}, 0 0 0 3px ${PRIMARY_COLOR}0A`, transform:"translateY(-1px)", "& .arr":{ opacity:1, transform:"translate(0,0)" } }, "&:active":{ transform:"translateY(0)" } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width:32, height:32, borderRadius:"10px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg, ${PRIMARY_COLOR}14, ${SECONDARY_COLOR}0E)`, border:`1px solid ${PRIMARY_COLOR}20`, fontSize:15 }}>{p.icon}</Box>
                        <Typography sx={{ fontFamily:T.font, fontSize:13.5, fontWeight:500, color:T.ink }}>{p.label}</Typography>
                      </Stack>
                      <NorthEastRoundedIcon className="arr" sx={{ fontSize:13, color:T.inkMuted, flexShrink:0, opacity:0, transform:"translate(-3px,3px)", transition:`all .18s ${T.ease}` }}/>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

          ) : (
            /* ─────────────────────────────────────────────────────
               ZONE CONVERSATION (messages)
            ──────────────────────────────────────────────────────── */
            <Box ref={listRef} className="chat-list" sx={{ flex:1, overflowY:"auto", minHeight:0, px:{ xs:2, sm:4, md:"10%", lg:"15%" }, py:3, bgcolor:T.canvas, backgroundImage:`radial-gradient(ellipse 55% 30% at 8% 0%, ${PRIMARY_COLOR}0D 0%, transparent 60%), radial-gradient(ellipse 40% 25% at 92% 100%, ${SECONDARY_COLOR}09 0%, transparent 55%)` }}>
              <TransitionGroup>{chat.map((m,i)=>renderMsg(m,i,chat[i-1]))}</TransitionGroup>

              {typing && (
                <Box sx={{ display:"flex", alignItems:"flex-end", gap:1.25, mb:1.5, animation:`fadeUp .28s ${T.spring}` }}>
                  <BotAvatar/>
                  <Box sx={{ px:2, py:1.5, bgcolor:T.surface, border:`1px solid ${T.border}`, borderRadius:"4px 18px 18px 18px", boxShadow:T.shadowSm, display:"flex", alignItems:"center", gap:"4px" }}>
                    {uploadProgress!==null
                      ? [0,1,2,3,4,5,6].map((j)=><Box key={j} sx={{ width:"3px", height:20, borderRadius:99, bgcolor:PRIMARY_COLOR, transformOrigin:"center", animation:`audioWave 0.8s ${j*0.1}s infinite ease-in-out` }}/>)
                      : [0,1,2].map((j)=><Box key={j} sx={{ width:7, height:7, borderRadius:"50%", bgcolor:SECONDARY_COLOR, animation:`tdot 1.35s ${j*.18}s infinite ease` }}/>)
                    }
                  </Box>
                </Box>
              )}
              <div ref={bottomRef}/>
            </Box>
          )}

          {/* FAB scroll */}
          {showScrollDown && hasChat && !recording && (
            <Box sx={{ position:"absolute", right:18, bottom:120, animation:`fadeUp .22s ${T.spring}` }}>
              <IconButton onClick={()=>scrollToBottom(true)} sx={{ width:34, height:34, bgcolor:T.surface, color:T.inkSub, border:`1px solid ${T.borderMed}`, boxShadow:T.shadowMd, "&:hover":{ bgcolor:T.surfaceHov } }}>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize:18 }}/>
              </IconButton>
            </Box>
          )}

          {/* ══ ENREGISTREMENT ACTIF — panel bas brand ══════════════ */}
          {recording && (
            <Box sx={{ flexShrink:0, bgcolor:T.surface, borderTop:`2px solid ${PRIMARY_COLOR}25`, px:{ xs:2, md:"10%", lg:"15%" }, pt:3, pb:3.5, position:"relative", overflow:"hidden" }}>
              {/* Fond teinté brand */}
              <Box sx={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 70% 100% at 50% 100%, ${PRIMARY_COLOR}08 0%, transparent 70%)`, pointerEvents:"none" }}/>

              {/* Grille de points */}
              <Box sx={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle, ${PRIMARY_COLOR}12 1px, transparent 1px)`, backgroundSize:"28px 28px", pointerEvents:"none", opacity:0.5 }}/>

              {/* Visualiseur barres live */}
              <Stack direction="row" justifyContent="center" alignItems="flex-end" sx={{ height:60, mb:2.5, gap:"3px", position:"relative", zIndex:1 }}>
                {WAVE_H.map((h,idx)=>{
                  const lh = Math.max(8, Math.min(100, h*(0.22+vuLevel*0.78)));
                  return (
                    <Box key={idx} sx={{ width:"3px", borderRadius:99, transition:"height .06s ease", height:`${lh}%`,
                      background:idx%2===0
                        ? `linear-gradient(to top, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`
                        : `linear-gradient(to top, ${PRIMARY_COLOR}80, ${SECONDARY_COLOR}80)`,
                    }}/>
                  );
                })}
              </Stack>

              {/* Chrono */}
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} mb={3} sx={{ position:"relative", zIndex:1 }}>
                <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:T.danger, animation:"recDot 1s infinite" }}/>
                <Typography sx={{ fontFamily:T.font, fontSize:15, fontWeight:700, color:T.ink }}>
                  Enregistrement · {clk(recMs)}
                </Typography>
              </Stack>

              {/* Boutons */}
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ position:"relative", zIndex:1 }}>
                <Tooltip title="Annuler">
                  <IconButton onClick={cancelRecording}
                    sx={{ width:52, height:52, borderRadius:"16px", bgcolor:T.canvas, border:`1px solid ${T.borderMed}`, color:T.inkSub, "&:hover":{ bgcolor:`${T.danger}0E`, borderColor:`${T.danger}40`, color:T.danger }, transition:`all .18s ${T.ease}` }}>
                    <CloseIcon sx={{ fontSize:22 }}/>
                  </IconButton>
                </Tooltip>

                {/* Gros bouton stop — garde le danger pour la clarté */}
                <Box sx={{ borderRadius:"50%", display:"inline-flex",
                  animation:"recRing 1.1s ease infinite",
                  "@keyframes recRing":{ "0%":{ boxShadow:`0 0 0 0 rgba(224,49,64,.55)` }, "70%":{ boxShadow:`0 0 0 24px rgba(224,49,64,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(224,49,64,0)` } },
                }}>
                  <IconButton onClick={stopRecording}
                    sx={{ width:76, height:76, borderRadius:"50%", bgcolor:T.danger, color:"#fff",
                      boxShadow:`0 8px 28px rgba(224,49,64,0.45)`,
                      "&:hover":{ bgcolor:"#c0272f", transform:"scale(1.07)", boxShadow:`0 12px 36px rgba(224,49,64,0.55)` },
                      "&:active":{ transform:"scale(0.93)" },
                      transition:`all .18s ${T.spring}` }}>
                    <StopIcon sx={{ fontSize:32 }}/>
                  </IconButton>
                </Box>

                <Box sx={{ width:52 }}/>
              </Stack>

              <Typography sx={{ fontFamily:T.font, fontSize:11, color:T.inkMuted, textAlign:"center", mt:2, position:"relative", zIndex:1 }}>
                Appuyez sur ■ pour envoyer · ✕ pour annuler
              </Typography>
            </Box>
          )}

          {/* ══ BARRE BAS (conversation existante, hors enregistrement) ══ */}
          {hasChat && !recording && (
            <Box sx={{ flexShrink:0, bgcolor:T.surface, borderTop:`1px solid ${T.border}`, px:{ xs:1.5, sm:3, md:"10%", lg:"15%" }, pt:1.5, pb:{ xs:2, md:1.75 } }}>

              {uploadProgress!==null && uploadProgress>=0 && (
                <Box sx={{ mb:1.5, px:1.75, py:1, bgcolor:`${PRIMARY_COLOR}0A`, border:`1px solid ${PRIMARY_COLOR}25`, borderRadius:"12px" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb:0.625 }}>
                    <GraphicEqRoundedIcon sx={{ fontSize:14, color:PRIMARY_COLOR }}/>
                    <Typography sx={{ fontFamily:T.font, fontSize:11.5, color:PRIMARY_COLOR, flex:1, fontWeight:600 }}>Traitement audio…</Typography>
                    <Typography sx={{ fontFamily:T.font, fontSize:11, fontWeight:700, color:PRIMARY_COLOR }}>{uploadProgress}%</Typography>
                  </Stack>
                  <Box sx={{ height:2, borderRadius:99, bgcolor:`${PRIMARY_COLOR}18`, overflow:"hidden" }}>
                    <Box sx={{ height:"100%", borderRadius:99, bgcolor:PRIMARY_COLOR, width:`${uploadProgress}%`, transition:"width .3s ease" }}/>
                  </Box>
                </Box>
              )}

              {textMode ? (
                /* ─ Mode texte opt-in ─ */
                <Stack direction="row" alignItems="flex-end" spacing={1}>
                  <Tooltip title="Mode vocal">
                    <IconButton onClick={()=>setShowText(false)}
                      sx={{ width:44, height:44, borderRadius:"13px", flexShrink:0, bgcolor:`${PRIMARY_COLOR}0E`, border:`1px solid ${PRIMARY_COLOR}30`, color:PRIMARY_COLOR, "&:hover":{ bgcolor:`${PRIMARY_COLOR}18` }, transition:`all .18s ${T.ease}` }}>
                      <MicIcon sx={{ fontSize:20 }}/>
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ flex:1, bgcolor:T.canvas, border:`1.5px solid ${T.borderMed}`, borderRadius:"16px", px:1.75, py:0.75, transition:`border-color .2s, box-shadow .2s`, "&:focus-within":{ borderColor:`${PRIMARY_COLOR}70`, boxShadow:`0 0 0 3px ${PRIMARY_COLOR}12`, bgcolor:T.surface } }}>
                    <TextField fullWidth multiline maxRows={6} placeholder="Votre message… (Maj+Entrée pour saut de ligne)"
                      variant="standard" value={userInput}
                      onChange={(e)=>e.target.value.length<=CHAR_LIMIT&&setUserInput(e.target.value)}
                      onKeyDown={(e)=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleSendText(); } }}
                      disabled={typing} InputProps={{ disableUnderline:true }}
                      sx={{ "& .MuiInputBase-root":{ fontFamily:T.font, fontSize:14.5, lineHeight:1.65, color:T.ink, py:0.5 }, "& .MuiInputBase-input::placeholder":{ color:T.inkMuted, opacity:1 }, "& .MuiInputBase-input:disabled":{ WebkitTextFillColor:T.inkMuted } }}
                    />
                    {CHAR_LIMIT-userInput.length<300 && (
                      <Typography sx={{ fontFamily:T.font, fontSize:10, fontWeight:700, color:(CHAR_LIMIT-userInput.length)<80?T.danger:T.inkMuted }}>{CHAR_LIMIT-userInput.length}</Typography>
                    )}
                  </Box>
                  <Tooltip title="Envoyer">
                    <span>
                      <IconButton onClick={()=>handleSendText()} disabled={typing||!userInput.trim()}
                        sx={{ width:44, height:44, borderRadius:"13px", flexShrink:0, bgcolor:userInput.trim()&&!typing?PRIMARY_COLOR:T.canvas, border:`1px solid ${userInput.trim()&&!typing?"transparent":T.borderMed}`, color:userInput.trim()&&!typing?"#fff":T.inkMuted, boxShadow:userInput.trim()&&!typing?`0 4px 14px ${PRIMARY_COLOR}45`:"none", "&:hover":userInput.trim()&&!typing?{ bgcolor:SECONDARY_COLOR, transform:"translateY(-1px)" }:{}, "&:disabled":{ opacity:0.38 }, transition:`all .2s ${T.spring}` }}>
                        {typing?<CircularProgress size={16} sx={{ color:T.inkMuted }}/>:<SendRoundedIcon sx={{ fontSize:17 }}/>}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              ) : (
                /* ─ Mode vocal (défaut) ─ */
                <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", py:0.5, position:"relative" }}>
                  {!isWolof && (
                    <Tooltip title="Écrire">
                      <IconButton onClick={()=>setShowText(true)}
                        sx={{ position:"absolute", left:0, width:42, height:42, borderRadius:"12px", bgcolor:T.canvas, border:`1px solid ${T.borderMed}`, color:T.inkMuted, "&:hover":{ color:T.inkSub, bgcolor:T.surfaceHov, borderColor:`${PRIMARY_COLOR}40` }, transition:`all .18s ${T.ease}` }}>
                        <KeyboardRoundedIcon sx={{ fontSize:18 }}/>
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Bouton micro — anneaux inline */}
                  <Box sx={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Box sx={{ position:"absolute", width:88, height:88, borderRadius:"50%", pointerEvents:"none",
                      animation:"ring3b 2s .6s ease infinite",
                      "@keyframes ring3b":{ "0%":{ boxShadow:`0 0 0 0 ${PRIMARY_COLOR}0C` }, "70%":{ boxShadow:`0 0 0 56px rgba(0,0,0,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(0,0,0,0)` } },
                    }}/>
                    <Box sx={{ position:"absolute", width:70, height:70, borderRadius:"50%", pointerEvents:"none",
                      animation:"ring2b 2s .3s ease infinite",
                      "@keyframes ring2b":{ "0%":{ boxShadow:`0 0 0 0 ${PRIMARY_COLOR}20` }, "70%":{ boxShadow:`0 0 0 38px rgba(0,0,0,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(0,0,0,0)` } },
                    }}/>
                    <Box sx={{ position:"absolute", width:54, height:54, borderRadius:"50%", pointerEvents:"none",
                      animation:"ring1b 2s ease infinite",
                      "@keyframes ring1b":{ "0%":{ boxShadow:`0 0 0 0 ${PRIMARY_COLOR}38` }, "70%":{ boxShadow:`0 0 0 20px rgba(0,0,0,0)` }, "100%":{ boxShadow:`0 0 0 0 rgba(0,0,0,0)` } },
                    }}/>
                    <IconButton onClick={startRecording} disabled={typing}
                      sx={{ width:52, height:52, borderRadius:"50%",
                        background:`linear-gradient(145deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                        color:"#fff", position:"relative", zIndex:1,
                        boxShadow:`0 6px 22px ${PRIMARY_COLOR}50`,
                        "&:hover":{ transform:"scale(1.1)", boxShadow:`0 10px 30px ${PRIMARY_COLOR}65` },
                        "&:active":{ transform:"scale(0.94)" },
                        "&:disabled":{ opacity:0.4 },
                        transition:`all .2s ${T.spring}` }}>
                      <MicIcon sx={{ fontSize:24 }}/>
                    </IconButton>
                  </Box>

                  <Box sx={{ position:"absolute", right:0 }}>
                    <Typography sx={{ fontFamily:T.font, fontSize:11, color:T.inkMuted }}>
                      {isWolof ? "🇸🇳 Wolof" : "🇫🇷 Français"}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Typography sx={{ fontFamily:T.font, fontSize:10, color:T.inkMuted, textAlign:"center", mt:1, letterSpacing:"0.02em" }}>
                {isWolof ? "Mode Wolof — vocal uniquement"
                  : textMode ? "Entrée pour envoyer · Maj+Entrée pour nouvelle ligne"
                  : "Appuyer sur le micro pour parler"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar open={Boolean(error)} autoHideDuration={3500} onClose={()=>setError("")} anchorOrigin={{ vertical:"top", horizontal:"center" }}>
        <Alert severity="error" onClose={()=>setError("")} variant="filled" sx={{ fontFamily:T.font, bgcolor:T.danger, borderRadius:"12px" }}>{error}</Alert>
      </Snackbar>
    </>
  );
}

/* ═══════════════════ ATOMS ════════════════════════════════════════ */
function BotAvatar() {
  return (
    <Box sx={{ width:30, height:30, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:`1.5px solid ${T.border}`, alignSelf:"flex-end", mb:0.5, boxShadow:T.shadowXs }}>
      <img src={chatbotMascot} alt="Bot" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
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
  return <Box sx={{ display:"flex", flexDirection:isUser?"row-reverse":"row", alignItems:"flex-end", gap:1, mb:1 }}>{children}</Box>;
}
function DayChip({ date }) {
  const label = date.toLocaleDateString(undefined, { weekday:"short", day:"2-digit", month:"short" });
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ my:3 }}>
      <Divider sx={{ flex:1, borderColor:T.border }}/>
      <Box sx={{ px:1.5, py:0.375, borderRadius:99, bgcolor:T.surface, border:`1px solid ${T.border}`, boxShadow:T.shadowXs }}>
        <Typography sx={{ fontSize:10, fontWeight:600, color:T.inkMuted, letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{label}</Typography>
      </Box>
      <Divider sx={{ flex:1, borderColor:T.border }}/>
    </Stack>
  );
}

/* ─ Bulle unifiée ─ */
function VoiceBubble({ isUser, isAudio, children, copyable, copyText="", timestamp }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(copyText); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch {} };

  const bg = isAudio
    ? isUser
      ? `linear-gradient(140deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`
      : `${PRIMARY_COLOR}0C`
    : isUser
      ? `linear-gradient(140deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`
      : T.surface;

  const border = isAudio && !isUser
    ? `1px solid ${PRIMARY_COLOR}25`
    : isUser ? "none" : `1px solid ${T.border}`;

  const shadow = isUser
    ? `0 4px 18px ${PRIMARY_COLOR}30`
    : T.shadowSm;

  return (
    <Tooltip title={new Date(timestamp).toLocaleString()} arrow placement={isUser?"left":"right"}>
      <Box sx={{ position:"relative", maxWidth:{ xs:"84%", sm:"72%", md:"62%" }, px:isAudio?1.5:2, py:isAudio?1.25:1.375, pr:copyable?4.5:isAudio?1.5:2, borderRadius:isUser?"18px 4px 18px 18px":"4px 18px 18px 18px", background:bg, border, boxShadow:shadow }}>
        {/* Badge "Message vocal" sur les bulles audio */}
        {isAudio && (
          <Stack direction="row" alignItems="center" spacing={0.625} sx={{ mb:0.875 }}>
            <MusicNoteRoundedIcon sx={{ fontSize:11, color:isUser?"rgba(255,255,255,0.65)":PRIMARY_COLOR }}/>
            <Typography sx={{ fontFamily:T.font, fontSize:9.5, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:isUser?"rgba(255,255,255,0.55)":`${PRIMARY_COLOR}CC` }}>
              Message vocal
            </Typography>
          </Stack>
        )}
        {children}
        <Typography sx={{ fontSize:"10px", mt:0.375, color:isUser?"rgba(255,255,255,0.45)":T.inkMuted, textAlign:isUser?"right":"left", letterSpacing:"0.02em", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>
          {new Date(timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
        </Typography>
        {copyable && (
          <Tooltip title={copied?"Copié ✓":"Copier"} placement="top">
            <IconButton size="small" onClick={copy} sx={{ position:"absolute", top:6, right:5, width:24, height:24, color:copied?T.success:T.inkMuted, "&:hover":{ bgcolor:T.surfaceHov, color:T.ink }, transition:"color .18s" }}>
              {copied?<CheckRoundedIcon sx={{ fontSize:12 }}/>:<ContentCopyRoundedIcon sx={{ fontSize:12 }}/>}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Tooltip>
  );
}

/* ═══════════════════ AUDIO PLAYER ════════════════════════════════ */
function fmtTime(s) { if(!isFinite(s)) return "--:--"; return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`; }

function AudioPlayer({ url, isUser, lastRate=1, onRate }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur]         = useState(0);
  const [cur, setCur]         = useState(0);
  const [anchor, setAnchor]   = useState(null);
  const pct = dur?(cur/dur)*100:0;

  useEffect(()=>{
    const a=ref.current; if(!a) return;
    a.addEventListener("loadedmetadata",()=>setDur(a.duration||0));
    a.addEventListener("timeupdate",    ()=>setCur(a.currentTime||0));
    a.addEventListener("ended",         ()=>setPlaying(false));
    a.playbackRate=lastRate;
  },[lastRate]);

  const toggle =()=>{ const a=ref.current; if(!a) return; if(playing){a.pause();setPlaying(false);}else a.play().then(()=>setPlaying(true)).catch(()=>{}); };
  const seek   =(e)=>{ const a=ref.current; if(!a) return; const r=e.currentTarget.getBoundingClientRect(); a.currentTime=Math.min(Math.max((e.clientX-r.left)/r.width,0),1)*(a.duration||0); };
  const setRate=(r)=>{ const a=ref.current; if(!a) return; a.playbackRate=r; onRate?.(r); setAnchor(null); };

  const fg    = isUser ? "rgba(255,255,255,0.95)"         : PRIMARY_COLOR;
  const fgDim = isUser ? "rgba(255,255,255,0.45)"         : `${PRIMARY_COLOR}80`;
  const barBg = isUser ? "rgba(255,255,255,0.20)"         : `${PRIMARY_COLOR}18`;
  const barFg = isUser ? "rgba(255,255,255,0.90)"         : PRIMARY_COLOR;
  const btnBg = isUser ? "rgba(255,255,255,0.15)"         : `${PRIMARY_COLOR}12`;
  const btnHov= isUser ? "rgba(255,255,255,0.26)"         : `${PRIMARY_COLOR}22`;

  return (
    <Box sx={{ minWidth:200 }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <IconButton size="small" onClick={toggle}
          sx={{ width:36, height:36, flexShrink:0, borderRadius:"50%", bgcolor:btnBg, color:fg, "&:hover":{ bgcolor:btnHov, transform:"scale(1.08)" }, transition:`all .15s ${T.ease}` }}>
          {playing?<PauseRoundedIcon sx={{ fontSize:17 }}/>:<PlayArrowRoundedIcon sx={{ fontSize:17 }}/>}
        </IconButton>
        <Box sx={{ flex:1 }}>
          <Box onClick={seek} sx={{ height:30, cursor:"pointer", display:"flex", alignItems:"center", gap:"2px" }}>
            {WAVE_H.map((h,i)=>(
              <Box key={i} sx={{ flex:1, height:`${h}%`, borderRadius:999, bgcolor:(i/WAVE_H.length)*100<pct?barFg:barBg, transition:"background .08s" }}/>
            ))}
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mt:"2px" }}>
            <Typography sx={{ fontSize:10, color:fgDim, fontVariantNumeric:"tabular-nums" }}>{fmtTime(cur)}</Typography>
            <Typography sx={{ fontSize:10, color:fgDim, fontVariantNumeric:"tabular-nums" }}>{fmtTime(dur)}</Typography>
          </Stack>
        </Box>
        <Stack spacing={0.25} alignItems="center">
          <IconButton size="small" onClick={(e)=>setAnchor(e.currentTarget)} sx={{ p:0.5, color:fgDim, "&:hover":{ color:fg } }}>
            <Typography sx={{ fontSize:10, fontWeight:700, lineHeight:1 }}>{lastRate}×</Typography>
          </IconButton>
          <IconButton size="small" component="a" href={url} download sx={{ p:0.5, color:fgDim, "&:hover":{ color:fg } }}>
            <DownloadRoundedIcon sx={{ fontSize:13 }}/>
          </IconButton>
        </Stack>
      </Stack>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)}
        PaperProps={{ sx:{ bgcolor:T.surface, border:`1px solid ${T.border}`, borderRadius:"12px", boxShadow:T.shadowLg, minWidth:72 } }}>
        {PLAYBACK_RATES.map((r)=>(
          <MenuItem key={r} onClick={()=>setRate(r)} selected={r===lastRate}
            sx={{ fontFamily:T.font, fontSize:13, fontWeight:r===lastRate?700:400, color:r===lastRate?PRIMARY_COLOR:T.inkSub, "&.Mui-selected":{ bgcolor:`${PRIMARY_COLOR}0C` }, py:0.75, "&:hover":{ bgcolor:T.surfaceHov } }}>
            {r}×
          </MenuItem>
        ))}
      </Menu>
      <audio ref={ref} src={url} preload="metadata"/>
    </Box>
  );
}