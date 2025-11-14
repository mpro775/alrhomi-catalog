export interface UserPayload {
  sub: string;
  role: 'rep' | 'admin';
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
