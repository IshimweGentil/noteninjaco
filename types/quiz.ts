export interface Question {
  id: number;
  type: 'mc' | 'sa' | 'sm'; // mc: multiple-choice, sa: short-answer, sm: select-multiple
  question: string;
  options?: { [key: string]: string }; // Only used for 'mc' and 'sm' types
  answer: string; // if options, use index starting with 0 to convert to character starting from A
}