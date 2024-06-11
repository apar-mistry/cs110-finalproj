'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";

// Utility functions to safely access sessionStorage
const getSessionStorageItem = (key) => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
};

const removeSessionStorageItem = (key) => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(key);
  }
};

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const nickname = getSessionStorageItem("nickname");
    if (nickname === null) {
      router.push(`/`);
      return;
    }

    const fetchChats = async () => {
      console.log(`Fetching chats for nickname: ${nickname}`);

      const response = await fetch("/api/get-user-messages", {
        method: "GET",
        headers: {
          nickname: nickname,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Rooms fetched:", data.rooms);
        setRooms(data.rooms);
      } else {
        console.error("Error fetching chats:", data.message);
      }
    };

    fetchChats();
  }, [router]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName }),
    });

    const data = await response.json();
    if (data.success) {
      router.push(`/room/${data.roomId}`);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    router.push(`/room/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    const response = await fetch("/api/delete-room", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    const data = await response.json();
    if (data.success) {
      setRooms(rooms.filter((room) => room.roomId !== roomId));
    } else {
      console.error("Error deleting room:", data.message);
    }
  };

  const handleLogout = () => {
    removeSessionStorageItem("nickname");
    router.push(`/`);
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleLogout}
        sx={{ color: 'red', borderColor: 'red', '&:hover': { borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.04)' } }}
      >
        Log Out
      </Button>
      <Head>
        <title>Chat Application</title>
      </Head>
      <Container>
        <Box mt={5}>
          <Typography variant="h3" align="center" gutterBottom>
            Chat Application
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Create a New Room
              </Typography>
              <form onSubmit={handleCreateRoom}>
                <TextField
                  label="Enter Room Name"
                  fullWidth
                  margin="normal"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
                <Button type="submit" variant="contained" color="primary">
                  Create Room
                </Button>
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Enter an Existing Room
              </Typography>
              <form onSubmit={handleJoinRoom}>
                <TextField
                  label="Enter Room ID"
                  fullWidth
                  margin="normal"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                />
                <Button type="submit" variant="contained" color="secondary">
                  Enter Room
                </Button>
              </form>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Typography variant="h5" gutterBottom>
              Your Chat Rooms
            </Typography>
            <Grid container spacing={3}>
              {rooms.map((room) => (
                <Grid item xs={12} md={4} key={room.roomId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{room.roomName}</Typography>
                      <Typography variant="body2">
                        Room ID: {room.roomId}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => router.push(`/room/${room.roomId}`)}
                      >
                        Enter Room
                      </Button>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleDeleteRoom(room.roomId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
