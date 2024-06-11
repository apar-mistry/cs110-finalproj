"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
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
  Button
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import { v4 as uuidv4 } from "uuid";

export default function RoomPage({ params }) {
  const router = useRouter();

  const { roomId } = params;
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  if(sessionStorage.getItem("nickname") === null) {
    router.push(`/`);
  }
  useEffect(() => {
    const savedNickname = sessionStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    } else {
      router.push("/");
    }

    const interval = setInterval(fetchMessages, 5000);
    fetchMessages();

    return () => clearInterval(interval);
  }, [roomId]);

  const fetchMessages = async () => {
    if (!roomId) return;
    try {
      const response = await axios.get(`/api/get-messages`, {
        params: { roomId },
      });
      setMessages(response.data.messages);
      setFilteredMessages(response.data.messages); // Set initial filtered messages
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
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
        messageId,
      });
      if (response.status === 200) {
        setMessageInput("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error posting message:", error);
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

  const handleSearch = (query) => {
    if (query) {
      const filtered = messages.filter((msg) =>
        msg.message.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
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
      <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => router.push(`/home`)}>
        Home
      </Button>
      <Container>
        <Box mt={3}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item>
              <Typography variant="h4">R'Chat Room</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">
                Room ID: {roomId}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">
                Nickname: {nickname}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box mt={3} mb={3}>
          <SearchBar onSearch={handleSearch} />
          <Paper
            elevation={3}
            id="messages-container"
            style={{ height: "400px", overflowY: "scroll", padding: "16px" }}
          >
            <List>
              {filteredMessages.map((msg) => (
                <ListItem key={msg.messageId}>
                  <ListItemText
                    primary={
                      editingMessageId === msg.messageId ? (
                        <TextField
                          value={editingMessageText}
                          onChange={(e) =>
                            setEditingMessageText(e.target.value)
                          }
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
                  {msg.sender === nickname && (
                    <>
                      <IconButton
                        onClick={() =>
                          editingMessageId === msg.messageId
                            ? saveEdit()
                            : startEditing(msg.messageId, msg.message)
                        }
                      >
                        {editingMessageId === msg.messageId ? (
                          <SaveIcon />
                        ) : (
                          <EditIcon />
                        )}
                      </IconButton>
                      <IconButton onClick={() => deleteMessage(msg.messageId)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
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
