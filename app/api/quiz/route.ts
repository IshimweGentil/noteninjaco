import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
Create a quiz based on the provided topics. The quiz should consist of a mix of question types, including multiple-choice questions (with single or multiple correct answers) and short-answer questions. The questions should vary in difficulty and cover key concepts related to the specified topics. Here are the details for the quiz:
Include more thorough problems such as for an MC question, what are the correct steps in order to solve this problem or like given this problem, write me an outline. For example in a Data Structures and Algorithms
problem would be like what data structure and/or algorithm is best for this coding problem? Which of these are the best approaches? What is the time and space complexity?
Why is this algorithm better than the other?

Difficulty Levels: Include a mix of easy, medium, and hard questions.
Question Types: Multiple-choice, Select Multiple, and Short Answers questions and problems.
Answer Key: Provide the correct answers for each question.
Output: In JSON format of Question[].
interface Question {
  type: 'mc' | 'sa' | 'sm'; // mc: multiple-choice, sa: short-answer, sm: select-multiple
  question: string;
  options?: { [key: string]: string }; // Only used for 'mc' and 'sm' types
  answers?: string[]; // Only used for 'mc' and 'sm' types
  answer?: string; // Only used for 'sa' type
}

Example Input: I'm having a hard time understanding Dynamic Programming.

Example Output (JSON format):
[
  {
    "type": "mc",
    "question": "What is dynamic programming primarily used for? (Select all that apply)",
    "options": {
      "A": "Optimizing recursive algorithms",
      "B": "Sorting data",
      "C": "Encryption",
      "D": "Problem-solving with overlapping subproblems"
    },
    "answers": ["A", "D"]
  },
  {
    "type": "mc",
    "question": "Which of the following are examples of problems that can be efficiently solved using dynamic programming? (Select all that apply)",
    "options": {
      "A": "Fibonacci sequence calculation",
      "B": "Quick sort",
      "C": "Longest common subsequence",
      "D": "Binary search"
    },
    "answers": ["A", "C"]
  },
  {
    "type": "sa",
    "question": "What is the primary advantage of using dynamic programming over a naive recursive approach?",
    "answer": "Dynamic programming reduces the time complexity by storing intermediate results to avoid redundant computations."
  },
  {
    "type": "sa",
    "question": "In dynamic programming, what is the term used to describe the technique of breaking a problem into smaller overlapping subproblems?",
    "answer": "Memoization"
  },
  {
    "type": "sa",
    "question": "Given a set of weights [1, 3, 4, 5] and a total weight of 7, what is the minimum number of weights needed to achieve the total weight using dynamic programming?",
    "answer": "2 (weights 3 and 4)"
  }
]
`;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Validate the input
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Request quiz generation from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: "gpt-4o-mini",
    });

    // Extract and clean up quiz data
    let quizText = completion.choices[0].message.content;

    // Remove backticks and extra characters if present
    quizText = quizText!.replace(/^```json|```$/g, '').trim();

    let quiz;
    try {
      if (quizText) quiz = JSON.parse(quizText);
    } catch (error) {
      throw new Error("Invalid JSON format in the response");
    }

    // Validate quiz structure
    if (!quiz || !Array.isArray(quiz)) {
      throw new Error("Invalid quiz format");
    }


    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}