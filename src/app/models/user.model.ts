
export interface User {
    id?: number;
    displayname: string | null;
    email: string | null;
    emailVerified: boolean;
    uid: string;
    role: number;
    provider: number;
  }

  export enum UserRole {
    Admin = 1,
    Owner = 2, 
    Subscriber = 3
  }

  export enum ProviderList{
    Google = 1,
    Facebook = 2,
    Apple = 3
  }