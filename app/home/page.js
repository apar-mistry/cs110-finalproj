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
} from "@mui/material";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const nickname = sessionStorage.getItem('nickname');
      if (!nickname) {
        router.push('/');
        return;
      }

      console.log(`Fetching chats for nickname: ${nickname}`);

      const response = await fetch('/api/get-user-messages', {
        method: 'GET',
        headers: {
          'nickname': nickname
        }
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Rooms fetched:', data.rooms);
        setRooms(data.rooms);
      } else {
        console.error('Error fetching chats:', data.message);
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

  return (
    <div>
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
                      <Typography variant="body2">Room ID: {room.roomId}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => router.push(`/room/${room.roomId}`)}
                      >
                        Enter Room
                      </Button>
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
