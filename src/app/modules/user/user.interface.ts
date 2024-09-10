export type TUser = {
  id: string;
  password: string;
  neddPasswordChange: boolean;
  role: "admin" | "student" | "faculty";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
};