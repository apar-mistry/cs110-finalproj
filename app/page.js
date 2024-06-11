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

import useStyles from './styles';

export default function Home() {
  const classes = useStyles(); 
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
      <Box className={classes.loginContainer}>
        <Paper elevation={3} className={classes.loginPaper}>
          <Typography variant="h4" className={classes.loginTitle} gutterBottom>
            Welcome
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            className={classes.tabs} // Added className
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
                className={classes.inputField} // Added className
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={classes.inputField} // Added className
              />
              <Button
                type="button"
                variant="contained"
                className={classes.formButton} // Added className
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
                className={classes.inputField} // Added className
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={classes.inputField} // Added className
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={classes.inputField} // Added className
              />
              <Button
                type="button"
                variant="contained"
                className={classes.formButton} // Added className
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
