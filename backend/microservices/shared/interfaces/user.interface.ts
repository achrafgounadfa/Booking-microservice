export interface User {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  EVENT_CREATOR = 'event-creator',
  USER = 'user',
}
