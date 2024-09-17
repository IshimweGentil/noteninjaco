import React, { useState, useEffect } from 'react';
import { Question } from '@/types/quiz';

const Quiz = ({ quiz }: { quiz: Question[] | null }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle submit button click
  const handleSubmit = () => {
    setIsSubmitted(!isSubmitted);
  };

  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  const convertNumberToChar = (num: number) => {
    return (num === 0) ? 'A' : 
           (num === 1) ? 'B' : 
           (num === 2) ? 'C' : 
           (num === 3) ? 'D' : '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isSubmitted && <p className="text-red-500 mb-2">Answers from AI may not be correct.</p>}
      {quiz.map((question, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold">Question {index + 1}:</h3>
          <p className="mt-2">{question.question}</p>

          {/* Render options for multiple-choice quiz */}
          {question.type === 'mc' && question.options && Array.isArray(question.options) && (
            <ul className="list-none mt-4">
              {question.options.map((option, idx) => (
                <li key={idx} className="mb-2">
                  <label className="flex items-center">
                    <input type="radio" disabled={isSubmitted} className="mr-1 self-start mt-[0.33rem]" />
                    {`${convertNumberToChar(idx)}) ${option}`}
                  </label>
                </li>
              ))}
            </ul>
          )}

          {/* Render options for select-multiple quiz */}
          {question.type === 'sm' && question.options && Array.isArray(question.options) && (
            <ul className="list-none mt-4">
              {question.options.map((option, idx) => (
                <li key={idx} className="mb-2">
                  <label className="flex items-center">
                    <input type="checkbox" disabled={isSubmitted} className="mr-1 self-start mt-[0.33rem]" />
                    {`${convertNumberToChar(idx)}) ${option}`}
                  </label>
                </li>
              ))}
            </ul>
          )}

          {/* Render textarea for short-answer quiz */}
          {question.type === 'sa' && (
            <textarea
              disabled={isSubmitted}
              className="resize-none text-black mt-2 w-full p-2 border border-gray-300 rounded overflow-y-auto"
              rows={3}
              placeholder="Your answer"
            />
          )}

          {/* Renders an answer for each question when submitted */}
          {isSubmitted && question.answer && (
            <p className="italic text-purple-600 mt-4"><strong>Correct Answer: </strong><span>{question.answer}</span></p>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          {!isSubmitted ? 'Submit' : 'Hide Answers'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;