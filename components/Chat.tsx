"use client";

import {
  Box,
  TextField,
  Avatar,
  Stack,
  IconButton,
  Container,
} from "@mui/material";
import { useChat } from "ai/react";
import { marked } from "marked";
import SendIcon from "@mui/icons-material/Send";
import React, { useState, useEffect } from "react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/chat",
    onError: (e) => {
      console.log(e);
    },
  });

  const [initialMessages, setInitialMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I am the AI Customer Support Agent at NoteNinja. How can I assist you today?",
    },
  ]);

  // Combine initialMessages with any new messages
  const combinedMessages = [...initialMessages, ...messages];

  return (
    <Container sx={{ flexGrow: 1, py: 3, height: "550px", width: "400px", position: "fixed", right: 0, bottom: 0, mb: "5.5rem", zIndex: 999 }}>
      <Stack
        direction={"column"}
        spacing={2}
        flexGrow={1}
        sx={{
          bgcolor: "grey.100",
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        <Box sx={{ overflowY: "auto", px: 3, py: 2, flexGrow: 1 }}>
          {combinedMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <Box
                key={index}
                display="flex"
                alignItems="flex-start"
                justifyContent={isUser ? "flex-end" : "flex-start"}
                sx={{
                  mb: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                {!isUser && (
                  <Avatar
                    alt="Assistant"
                    src={``}
                    sx={{ marginRight: 2 }}
                  />
                )}
                <Box
                  component="div"
                  bgcolor={isUser ? "grey.500" : "grey.800"}
                  color="white"
                  borderRadius={16}
                  p={2}
                  maxWidth="70%"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(message.content),
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            borderTop: 1,
            borderColor: "divider",
            p: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
          }}
        >
          <TextField
            label="Type your message"
            fullWidth
            value={input}
            onChange={handleInputChange}
            variant="outlined"
            sx={{
              marginRight: 2,
              bgcolor: "grey.100",
              borderRadius: 2,
            }}
          />
          <IconButton color="primary" onClick={handleSubmit}>
            <SendIcon />
          </IconButton>
        </Box>
      </Stack>
    </Container>
  );
}
