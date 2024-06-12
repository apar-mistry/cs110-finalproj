'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import BokehBackground from "./components/BokehBackground";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrorMessage(""); // Clear the error message when the tab changes
  };

  const handleLogin = async () => {
    if (nickname && password) {
      try {
        const response = await axios.post('/api/get-login', { nickname, password });
        if (response.status === 200) {
          sessionStorage.setItem('nickname', nickname);
          router.push('/home');
        }
      } catch (error) {
        setErrorMessage('Error logging in: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const handleCreateUser = async () => {
    if (nickname && email && password) {
      try {
        const response = await axios.post('/api/create-user', { nickname, email, password });
        if (response.status === 201) {
          sessionStorage.setItem('nickname', nickname);
          router.push('/home');
        }
      } catch (error) {
        setErrorMessage('Error creating user: ' + error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <Container>
      <Box mt={10} display="flex" justifyContent="center">
        <Paper elevation={3} style={{ padding: "20px", width: "400px" }}>
          <Typography variant="h4" gutterBottom>
            <Typewriter
              words={["Welcome to R'Chat"]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Log In" />
            <Tab label="Create User" />
          </Tabs>
          {activeTab === 0 && (
            <Box mt={3}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <TextField
                label="Nickname"
                fullWidth
                margin="normal"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleLogin}
                fullWidth
              >
                Log In
              </Button>
            </Box>
          )}
          {activeTab === 1 && (
            <Box mt={3}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <TextField
                label="Nickname"
                fullWidth
                margin="normal"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleCreateUser}
                fullWidth
              >
                Create User
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
