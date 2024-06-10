"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import {
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export default function RoomPage({ params }) {
  const { roomId } = params;
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  useEffect(() => {
    const savedNickname = sessionStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    } else {
      const nickname = prompt("Enter your nickname:", "Anonymous");
      if (nickname !== null) {
        setNickname(nickname);
        sessionStorage.setItem("nickname", nickname);
      } else {
        setNickname("Anonymous");
        sessionStorage.setItem("nickname", "Anonymous");
      }
    }

    const interval = setInterval(fetchMessages, 5000);
    fetchMessages();

    return () => clearInterval(interval);
  }, [roomId]);

  const fetchMessages = async () => {
    if (!roomId) return;
    try {
      const response = await axios.get(`/api/get-messages`, {
        params: { roomId }
      });
      setMessages(response.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const postMessage = async (e) => {
    e.preventDefault();
    if (!messageInput) return;
    const messageId = uuidv4(); // Generate a unique messageId
    try {
      const response = await axios.post("/api/post-message", {
        roomId,
        message: messageInput,
        nickname,
        messageId
      });
      if (response.status === 200) {
        setMessageInput("");
        fetchMessages();
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Los_Angeles",
      timeZoneName: "short",
    };
    return new Date(timestamp).toLocaleString("en-US", options);
  };

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const startEditing = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditingMessageText(currentText);
  };

  const saveEdit = async () => {
    if (!editingMessageId || !editingMessageText) return;
    try {
      const response = await axios.post("/api/edit-message", {
        roomId,
        messageId: editingMessageId,
        newMessage: editingMessageText,
        nickname,
      });
      if (response.status === 200) {
        setEditingMessageId(null);
        setEditingMessageText("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await axios.post("/api/delete-message", {
        roomId,
        messageId,
      });
      if (response.status === 200) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>Room {roomId}</title>
      </Head>
      <Container>
        <Box mt={3}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item>
              <Typography variant="h4">Chat Room</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Room ID: <strong>{roomId}</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Nickname: <strong>{nickname}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box mt={3} mb={3}>
          <Paper
            elevation={3}
            id="messages-container"
            style={{ height: "400px", overflowY: "scroll", padding: "16px" }}
          >
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.messageId}>
                  <ListItemText
                    primary={
                      editingMessageId === msg.messageId ? (
                        <TextField
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          fullWidth
                        />
                      ) : (
                        <>
                          <strong>{msg.sender}</strong>: {msg.message}
                        </>
                      )
                    }
                    secondary={formatTimestamp(msg.timestamp)}
                  />
                  <IconButton
                    onClick={() =>
                      editingMessageId === msg.messageId
                        ? saveEdit()
                        : startEditing(msg.messageId, msg.message)
                    }
                  >
                    {editingMessageId === msg.messageId ? <SaveIcon /> : <EditIcon />}
                  </IconButton>
                  <IconButton onClick={() => deleteMessage(msg.messageId)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        <Box>
          <form onSubmit={postMessage}>
            <TextField
              label="Message"
              fullWidth
              margin="normal"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      color={messageInput ? "primary" : "default"}
                      onClick={postMessage}
                      disabled={!messageInput}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Box>
      </Container>
    </div>
  );
}
