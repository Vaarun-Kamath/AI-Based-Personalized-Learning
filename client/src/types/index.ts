export type AuthPayload = {
  username: string;
  email: string;
  user_id: string | null;
};

export type ExamType = {
  id: string;
  title: string;
  questions: number;
  time: number;
};
