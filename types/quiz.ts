export interface Question {
  id: number;
  type: 'mc' | 'sa' | 'sm'; // mc: multiple-choice, sa: short-answer, sm: select-multiple
  question: string;
  options?: { [key: string]: string }; // Only used for 'mc' and 'sm' types
  answers?: string[]; // Only used for 'mc' and 'sm' types
  answer?: string; // Only used for 'sa' type
}