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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    console.log("convId", convId);
    setNewTitle(currentTitle);
    //handleCloseMenu();
  };

  const handleRename = async (convId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_BACK_URL}/conversations/${convId}/rename`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversations((prev) =>
        prev.map((c) => (c._id === convId ? { ...c, title: newTitle } : c))
      );

      const res = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/conversations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConversations(res.data);

      setEditingId(null);
      setNewTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteConversation = async () => {
    setAnchorEl(false);
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/conversations/${selectedConvId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversations((prev) => prev.filter((c) => c._id !== selectedConvId));
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      handleCloseMenu();
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      console.log("Forcing focus with delay...");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [editingId]);

  return (
    <Box
      sx={{
        width: "300px",
        borderRight: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Conversations
      </Typography>
      <Divider />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2, borderRadius: 2 }}
        onClick={() => navigate("/chatbot")}
      >
        Nouvelle conversation
      </Button>
      <List>
        {conversations.map((conv) => (
          <ListItem
            key={conv._id}
            selected={conv._id === selectedId}
            sx={{
              "&:hover": { backgroundColor: "#eee" },
              borderRadius: 2,
              mb: 1,
              pl: 1,
              pr: 1,
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
                //onBlur={() => handleRename(conv._id)}
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
                      fontWeight: conv._id === selectedId ? "bold" : "normal",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/chatbot/conv/${conv._id}`)}
                  >
                    {conv.title || "Sans titre"}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: "0.75rem" }}>
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
            setAnchorEl(false);
            startRename(
              selectedConvId,
              conversations.find((c) => c._id === selectedConvId)?.title || ""
            );
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
