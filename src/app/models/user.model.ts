
export interface User {
    DisplayName: string | null;
    Email: string | null;
    EmailVerified: boolean;
    Uid: string;
    Role: number;
    Provider: number;
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