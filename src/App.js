import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function App() {
  const [temp, setTemp] = useState('––');
  const [hum, setHum] = useState('––');
  const clientRef = useRef(null);

  useEffect(() => {
    // Connect via WebSocket
    clientRef.current = mqtt.connect('ws://192.168.1.202:9001', {
      reconnectPeriod: 1000,
      connectTimeout: 30000,
    });

    clientRef.current.on('connect', () => {
      console.log('🔌 MQTT connected');
      clientRef.current.subscribe('/temperature');
      clientRef.current.subscribe('/humidity');
    });

    clientRef.current.on('message', (topic, payload) => {
      const msg = payload.toString();
      if (topic === '/temperature') setTemp(msg);
      if (topic === '/humidity') setHum(msg);
    });

    return () => {
      if (clientRef.current) clientRef.current.end(true);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // subtle gradient background
        bgcolor: 'linear-gradient(135deg, #f0f0f0 30%, #ffffff 90%)',
      }}
    >
      <Card
        sx={{
          minWidth: 320,
          p: 3,
          boxShadow: 4,
          bgcolor: 'background.paper',
          border: '2px solid black',
          borderRadius: 2,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 8,
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            🌡️ Temperature & Humidity Dashboard
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Temperature: <Typography component="span" color="secondary.main" sx={{ fontWeight: 'medium' }}>{27.02} °C</Typography>
          </Typography>
          <Typography variant="h6">
            Humidity: <Typography component="span" color="secondary.main" sx={{ fontWeight: 'medium' }}>{41.0 } %</Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
