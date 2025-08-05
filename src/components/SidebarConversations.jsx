import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
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
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

const SidebarConversations = ({
  conversations,
  selectedId,
  setConversations,
}) => {
  const navigate = useNavigate();
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event, convId) => {
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
      setConversations((prev) => prev.filter((c) => c._id !== selectedConvId));
      navigate("/chatbot");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [editingId]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "300px" },
        height: "100vh",
        borderRight: { md: "1px solid #ccc" },
        backgroundColor: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Tooltip title="Retour">
          <IconButton
            sx={{ color: PRIMARY_COLOR }}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography color={PRIMARY_COLOR} variant="h6" fontWeight="bold">
          Conversations
        </Typography>
        <Tooltip title="Nouvelle conversation">
          <IconButton
            sx={{ color: SECONDARY_COLOR }}
            onClick={() => navigate("/chatbot")}
          >
            {" "}
            <AddCommentIcon />{" "}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {conversations.map((conv) => (
          <ListItem
            key={conv._id}
            selected={conv._id === selectedId}
            sx={{
              "&:hover": { backgroundColor: "#f0f0f0" },
              borderRadius: 2,
              mb: 1,
              pl: 1,
              pr: 1,
              bgcolor: conv._id === selectedId ? "#E3F2FD" : "transparent",
              transition: "background-color 0.3s ease",
            }}
            secondaryAction={
              <IconButton onClick={(e) => handleMenuClick(e, conv._id)}>
                <MoreVertIcon />
              </IconButton>
            }
          >
            {editingId === conv._id ? (
              <TextField
                inputRef={inputRef}
                variant="standard"
                autoFocus
                value={newTitle}
                fullWidth
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(conv._id);
                }}
                sx={{ "& input": { fontSize: "0.9rem" } }}
              />
            ) : (
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: conv._id === selectedId ? "bold" : "medium",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/chatbot/conv/${conv._id}`)}
                  >
                    {conv.title || "Sans titre"}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    {formatDate(conv.created_at)}
                  </Typography>
                }
              />
            )}
          </ListItem>
        ))}
      </List>

      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            startRename(
              selectedConvId,
              conversations.find((c) => c._id === selectedConvId)?.title || ""
            );
            handleCloseMenu();
          }}
        >
          Renommer
        </MenuItem>
        <MenuItem onClick={deleteConversation}>Supprimer</MenuItem>
      </Menu>
    </Box>
  );
};

export default SidebarConversations;
