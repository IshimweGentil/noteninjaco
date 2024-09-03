import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';
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
} from "@mui/material";
import { writeBatch, doc, getDoc, collection } from 'firebase/firestore';
import MagicButton from './ui/MagicButton';
import { ArrowRight } from 'lucide-react';

const TextTab = () => {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    // Send the text to the API to generate flashcards
    fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (index: number) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
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
      alert('Please enter a name for your flashcard set');
      return;
    }
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f: any) => f.name === name)) {
        alert('Flashcard set already exists');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard: any) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    setOpen(false);
    // Optionally handle navigation or state reset after saving
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-2 border-2 border-gray-600 border-dashed rounded-md bg-transparent"
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-start">
        <MagicButton
          title="Generate"
          icon={<ArrowRight size={16} />}
          position="right"
          onClick={handleGenerate}
        />
      </div>

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

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
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
    </div>
  );
}

export default TextTab;
