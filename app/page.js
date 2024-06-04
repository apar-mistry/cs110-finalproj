'use client'
import { useState } from "react";
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
} from "@mui/material";
import axios from 'axios';

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
        console.error('Error logging in:', error.response.data.message);
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
        console.error('Error creating user:', error.response.data.message);
      }
    }
  };

  return (
    <Container>
      <Box mt={10} display="flex" justifyContent="center">
        <Paper elevation={3} style={{ padding: "20px", width: "400px" }}>
          <Typography variant="h4" gutterBottom>
            Welcome
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
