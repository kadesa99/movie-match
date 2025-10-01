import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const UserSelectionPage = ({ setUser }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Wer bist du?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Button fullWidth variant="contained" onClick={() => setUser('Karen')}>
            Karen
          </Button>
          <Button fullWidth variant="contained" onClick={() => setUser('Tom')}>
            Tom
          </Button>
          <Button fullWidth variant="contained" onClick={() => setUser('Thalia')}>
            Thalia
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserSelectionPage;
