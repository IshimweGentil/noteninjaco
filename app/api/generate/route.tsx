import { NextResponse } from "next/server";
import OpenAI from "openai";

// Define the system prompt for generating flashcards
const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and application.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.

Remember, the goal is to facilitate effective learning and retention of the information through these flashcards.

You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

// Define the structure of a flashcard
interface Flashcard {
  front: string;
  back: string;
}

// Define the structure of the API response
interface FlashcardResponse {
  flashcards: Flashcard[];
}

// Export the POST function to handle the POST request
export async function POST(req: Request) {
  // Ensure the API key is set
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key is not set" }, { status: 500 });
  }

  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  try {
    const data = await req.text();

    // OpenAI API call
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      model: "gpt-4-0314",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("Received empty content from OpenAI API");
    }

    const parsedContent: FlashcardResponse = JSON.parse(content);

    // Validate the parsed content
    if (!Array.isArray(parsedContent.flashcards)) {
      throw new Error("Invalid response format from OpenAI API");
    }

    // Return the flashcards as a JSON response
    return NextResponse.json(parsedContent.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}