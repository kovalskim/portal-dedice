export interface User {
  id: string;
  beforeTitle: string;
  firstname: string;
  lastname: string;
  afterTitle: string;
  email: string;
  isVerified: boolean;
  isBanned: boolean;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}
