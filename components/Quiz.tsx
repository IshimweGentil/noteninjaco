import React, { useState } from 'react';
import { Question } from '@/types/quiz';

interface QuizProps {
  quiz: Question[] | null;
}

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle submit button click
  const handleSubmit = () => {
    setIsSubmitted(!isSubmitted);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {quiz!.map((question, index) => (
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

          {/* Render textarea for short-answer quiz */}
          {question.type === 'sa' && (
            <textarea
              disabled={isSubmitted}
              className="resize-none text-black mt-2 w-full p-2 border border-gray-300 rounded overflow-y-auto"
              rows={3}
              placeholder="Your answer"
            />
          )}

          {/* Render answer for short-answer quiz */}
          {question.type === 'sa' && isSubmitted && question.answer && (
            <p className="italic text-purple-600 mt-4"><strong>Correct Answer: </strong><span>{question.answer}</span></p>
          )}

          {/* Render answer for multiple-choice and select-all questions */}
          {question.type === 'mc' && isSubmitted && question.answers && (
            <p className="text-purple-600"><strong>Correct Answer: </strong><span>{Array.isArray(question.answers) ? question.answers.join(', ') : question.answers}</span></p>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          {!isSubmitted ? `Submit` : `Hide Answers`}
        </button>
      </div>
    </div>
  );
};

export default Quiz;