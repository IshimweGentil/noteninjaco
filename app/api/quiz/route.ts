import { NextResponse } from "next/server";
import OpenAI from "openai";
import {createStream} from "@/utils/streamUtil"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
Purpose:
Create a quiz based on the provided topics like a real exam. The quiz should assess both the user’s understanding and problem-solving skills through a variety of question types and difficulty levels.

Specifications:
- Include thorough problems that require deeper analysis. For multiple-choice questions, provide detailed steps or outlines for solving the problem. For example, in the context of Data Structures and Algorithms, you might ask about the best data structure or algorithm for a problem, the best approach, the time and space complexity, or the reasoning behind choosing one algorithm over another.
- Questions should not only test basic knowledge but also evaluate the user's problem-solving abilities with hypothetical and practical problems.
- There should be around 15 to 25 questions total. For the short answers, there should be three to seven and it should be medium and at least one hard difficulty. For multiple choice and select multiple questions, it should be more medium difficulty than easy and fill in the remaining number of questions.

Quiz Structure:
- Difficulty Levels: Include a mix of easy, medium, and hard questions.
- Question Types: Multiple-choice, Select Multiple, and Short Answer questions and problems.
- Answer Key: Provide the correct answers for each question.

Quiz Format:
- interface Question {
    type: 'mc' | 'sa' | 'sm'; // 'mc': multiple-choice, 'sa': short-answer, 'sm': select-multiple
    question: string;
    options?: { [key: string]: string }; // Only used for 'mc' and 'sm' types
    answer: string; // if options, use index starting with 0 to convert to character starting from A for the answer
  }
- Output: In JSON format only consisting of Question[]. Make sure it is JSON parsable, instead of new line spacings, use \\n or space.

Example:
Example Input: Dynamic Programming.
Example Output (JSON format):
[
  {
    "type": "sm",
    "question": "What is dynamic programming primarily used for? (Select all that apply)",
    "options": [
      "Optimizing recursive algorithms",
      "Sorting data",
      "Encryption",
      "Problem-solving with overlapping subproblems"
    ],
    "answer": "A, D"
  },
  {
    "type": "sm",
    "question": "Which of the following are examples of problems that can be efficiently solved using dynamic programming? (Select all that apply)",
    "options": [
      "Fibonacci sequence calculation",
      "Quick sort",
      "Longest common subsequence",
      "Binary search"
    ],
    "answer": "A, C"
  },
  {
    "type": "mc",
    "question": "What is the primary advantage of using dynamic programming over a naive recursive approach?",
    "options": [
      "Reduces the time complexity by storing intermediate results to avoid redundant computations.",
      "Increases the space complexity for better performance.",
      "Simplifies the code by removing recursion.",
      "Improves the accuracy of the algorithm."
    ],
    "answer": "A"
  },
  {
    "type": "mc",
    "question": "In dynamic programming, what is the term used to describe the technique of breaking a problem into smaller overlapping subproblems?",
    "options": [
      "Memoization",
      "Tabulation",
      "Greedy algorithm",
      "Divide and conquer"
    ],
    "answer": "A"
  },
  {
    "type": "mc",
    "question": "Given a set of weights [1, 3, 4, 5] and a total weight of 7, what is the minimum number of weights needed to achieve the total weight using dynamic programming?",
    "options": [
      "2 (weights 3 and 4)",
      "3 (weights 1, 3, and 3)",
      "4 (weights 1, 1, 1, and 4)",
      "1 (weight 7)"
    ],
    "answer": "A"
  },
  {
    "type": "mc",
    "question": "The Knapsack Problem can be solved using dynamic programming with either a 1-D or 2-D array. Which of the following steps correctly describes the process for solving the Knapsack Problem using a 2-D DP array?",
    "options": [
      "Initialize a 2-D array where each cell dp[i][w] represents the maximum value achievable with the first i items and weight limit w. Iterate through all items and capacities to fill the table based on inclusion or exclusion of each item.",
      "Use a 1-D array to store the maximum values for each capacity. Iterate over items and update the array from the last capacity to the first.",
      "Sort the items based on their weights and iterate to select items greedily, keeping track of the total weight and value.",
      "Use a binary search to find the optimal items that fit within the weight limit."
    ],
    "answer": "A"
  },
  {
    "type": "mc",
    "question": "When solving the Knapsack Problem, which approach is more space-efficient when using dynamic programming?",
    "options": [
      "1-D DP array",
      "2-D DP array",
      "Greedy approach",
      "Binary search approach"
    ],
    "answer": "A"
  },
  {
    "type": "sa",
    "question": "**Description:** The Knapsack Problem involves selecting a subset of items to maximize the total value while staying within a weight limit. Each item has a weight and a value.\n\n**Inputs:**\n- weights: An array of integers where weights[i] is the weight of the ith item.\n- values: An array of integers where values[i] is the value of the ith item.\n- capacity: An integer representing the maximum weight capacity of the knapsack.\n\n**Outputs:**\n- The maximum value that can be achieved with the given weight capacity.\n\n**Constraints:**\n- The weight capacity and item weights are non-negative integers.\n- The number of items is a positive integer.\n\n**Example Input:**\n- weights: [2, 3, 4, 5]\n- values: [3, 4, 5, 6]\n- capacity: 5\n\n**Example Output:**\n- Maximum value: 7\n\nExplain how dynamic programming can be used to solve this problem and discuss the time complexity of the approach.",
    "answer": "Dynamic programming can be used to solve the Knapsack Problem by constructing a DP table where each entry dp[i][w] represents the maximum value achievable with the first i items and weight limit w. You fill the table by deciding for each item whether to include it in the knapsack or not. The time complexity is O(n*W), where n is the number of items and W is the maximum weight capacity of the knapsack."
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

    // Extract quiz content
    let quizContent = completion.choices[0].message.content;
    console.log("=====START=====")
    console.log(quizContent);
    console.log("=====END=====")

    // Remove markdown from quiz content
    quizContent = quizContent!.replace(/^```json|```$/g, '').trim();

    let quiz;
    try {
      if (quizContent) quiz = JSON.parse(quizContent);
    } catch (error) {
      throw new Error("Invalid JSON format in the response");
    }

    // Validate quiz structure
    if (!quiz || !Array.isArray(quiz)) {
      throw new Error("Invalid quiz format");
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}