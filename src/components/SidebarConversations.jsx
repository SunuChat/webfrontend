import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCommentIcon from "@mui/icons-material/AddComment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PRIMARY_COLOR } from "../constants";

const SidebarConversations = ({
  conversations,
  selectedId,
  setConversations,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event, convId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedConvId(convId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedConvId(null);
  };

  const startRename = (convId, currentTitle) => {
    setEditingId(convId);
    setNewTitle(currentTitle);
  };

  const handleRename = async (convId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${process.env.REACT_APP_BACK_URL}/conversations/${convId}/rename`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/conversations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversations(res.data);
      setEditingId(null);
      setNewTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteConversation = async () => {
    handleCloseMenu();
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/conversations/${selectedConvId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversations((prev) =>
        prev.filter((c) => c._id !== selectedConvId)
      );

      navigate("/chatbot");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [editingId]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 320 },
        height: "100vh",
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 2,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Tooltip title="Retour">
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#F1F5F9",
              "&:hover": { bgcolor: "#E2E8F0" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Typography fontWeight={700} fontSize="1rem">
          Conversations
        </Typography>

        <Tooltip title="Nouvelle conversation">
          <IconButton
            onClick={() => navigate("/chatbot")}
            sx={{
              bgcolor: PRIMARY_COLOR,
              color: "#fff",
              "&:hover": { bgcolor: PRIMARY_COLOR },
            }}
          >
            <AddCommentIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Conversations */}
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {conversations.map((conv) => {
          const isSelected = conv._id === selectedId;

          return (
            <ListItem key={conv._id} disablePadding sx={{ mb: 1 }}>
              <Box
                onClick={() =>
                  navigate(`/chatbot/conv/${conv._id}`)
                }
                sx={{
                  width: "100%",
                  p: 1.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "#E3F2FD"
                    : "#FFFFFF",
                  border: isSelected
                    ? `1px solid ${PRIMARY_COLOR}`
                    : "1px solid #E5E7EB",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(0,0,0,0.08)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.08)",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                {editingId === conv._id ? (
                  <TextField
                    inputRef={inputRef}
                    variant="standard"
                    fullWidth
                    value={newTitle}
                    onChange={(e) =>
                      setNewTitle(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleRename(conv._id);
                    }}
                  />
                ) : (
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography
                      fontWeight={isSelected ? 600 : 500}
                      fontSize="0.9rem"
                      noWrap
                    >
                      {conv.title || "Sans titre"}
                    </Typography>
                    <Typography
                      fontSize="0.7rem"
                      color="text.secondary"
                    >
                      {formatDate(conv.created_at)}
                    </Typography>
                  </Box>
                )}

                <IconButton
                  onClick={(e) =>
                    handleMenuClick(e, conv._id)
                  }
                  sx={{
                    opacity: 0,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          );
        })}
      </List>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            startRename(
              selectedConvId,
              conversations.find(
                (c) => c._id === selectedConvId
              )?.title || ""
            );
            handleCloseMenu();
          }}
        >
          Renommer
        </MenuItem>
        <MenuItem onClick={deleteConversation}>
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SidebarConversations;
