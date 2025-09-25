export type Role = 'admin' | 'user';

export interface JwtPayload {
  userId: string;
  role: Role;
}