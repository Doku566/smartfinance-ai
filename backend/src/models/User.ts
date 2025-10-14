// User model types (Prisma generates these automatically)
// This file is for additional User-related types and interfaces

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  message: string;
}