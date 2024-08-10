
// components/Settings.js
import React, { useState } from 'react';
import {
  Box, Typography, Switch, FormControlLabel, TextField, Button, FormGroup, Paper
} from '@mui/material';

export default function Settings({ darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [receiveEmails, setReceiveEmails] = useState(true);

  const handleEmailChange = (event) => setEmail(event.target.value);
  const toggleEmailNotifications = () => setReceiveEmails(!receiveEmails);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label="Dark Mode"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          User Profile
        </Typography>
        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={handleEmailChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary">
          Update Profile
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          Notification Preferences
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={receiveEmails} onChange={toggleEmailNotifications} />}
            label="Receive Email Notifications"
          />
        </FormGroup>
      </Box>
    </Paper>
  );
}
