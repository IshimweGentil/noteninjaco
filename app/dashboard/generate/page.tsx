"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import FileUploadArea from "@/components/FileUploadArea";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { writeBatch, doc, getDoc, collection } from "firebase/firestore";
import Transcribe from "@/components/Transcribe"

const GeneratePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [inputMethod, setInputMethod] = useState<"textWithSpeech" | "pdf">("textWithSpeech");
  const [flashcards, setFlashcards] = useState<
    { front: string; back: string }[]
  >([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [text, setText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  const handleInputMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputMethod(event.target.value as "textWithSpeech" | "pdf");
  };

  const handleSubmit = async () => {
    const requestData = inputMethod === "textWithSpeech" ? text : "pdf";
    fetch("/api/generate", {
      method: "POST",
      body: requestData,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your flashcard set");
      return;
    }
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user!.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f: { name: string }) => f.name === name)) {
        alert("Flashcard set already exists");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Choose Input Method:
          </Typography>
          <RadioGroup
            row
            aria-label="inputMethod"
            name="inputMethod"
            value={inputMethod}
            onChange={handleInputMethodChange}
          >
            <FormControlLabel
              value="textWithSpeech"
              control={<Radio />}
              label="Paste Text"
            />
            <FormControlLabel
              value="pdf"
              control={<Radio />}
              label="Upload PDF"
            />
          </RadioGroup>

          {inputMethod === "textWithSpeech" ? (
            <Transcribe text={text} setText={setText} />
          ) : (
            <FileUploadArea setText={setText} /> // Pass setText to handle extracted text
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          position: "relative",
                          width: "100%",
                          height: "200px",
                        }}
                      >
                        <Box
                          sx={{
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          }}
                        >
                          {/* Front Side */}
                          <Box
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <Typography variant="h6">
                              {flashcard.front}
                            </Typography>
                          </Box>
                          {/* Back Side */}
                          <Box
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#f0f0f0",
                              transform: "rotateY(180deg)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <Typography variant="h6">
                              {flashcard.back}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GeneratePage;
