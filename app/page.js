"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");

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
        </Box>
      </Container>
    </div>
  );
}
