import React, { useState } from 'react';
import { Question } from '@/types/quiz';

interface QuizProps {
  quiz: Question[] | null;
}

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle submit button click
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {quiz.map((question, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold">Question {index + 1}:</h3>
          <p className="mt-2">{question.question}</p>

          {/* Render options for multiple-choice quiz */}
          {question.type === 'mc' && question.options && (
            <ul className="list-none mt-4">
              {Object.entries(question.options).map(([key, value]) => (
                <li key={key} className="mb-2">
                  <label className="flex items-center">
                    <input type="radio" disabled className="mr-2" />
                    {key}: {value}
                  </label>
                </li>
              ))}
            </ul>
          )}

          {/* Render options for select-multiple quiz */}
          {question.type === 'sm' && question.options && (
            <ul className="list-none mt-4">
              {Object.entries(question.options).map(([key, value]) => (
                <li key={key} className="mb-2">
                  <label className="flex items-center">
                    <input type="checkbox" disabled className="mr-2" />
                    {key}: {value}
                  </label>
                </li>
              ))}
            </ul>
          )}

          {/* Render answer for short-answer quiz */}
          {question.type === 'sa' && isSubmitted && question.answer && (
            <p className="italic text-gray-700 mt-4">{question.answer}</p>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Quiz;