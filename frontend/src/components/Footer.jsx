import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f7f7f7', // Light grey background for the footer
        py: 3,                      // Vertical padding
        px: 2,                      // Horizontal padding
        mt: 'auto',                 // Pushes footer to the bottom
        borderTop: '1px solid #ddd', // Subtle top border
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {'© '}

          {/* Display the site name and current year dynamically */}
            AsteroidWatch
          {' '}
          {new Date().getFullYear()}
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;