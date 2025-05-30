
export interface User {
    id?: number;
    provider: string;
    name: string;
    email: Date;
    emailVerified: boolean;
    userToken: string
  }