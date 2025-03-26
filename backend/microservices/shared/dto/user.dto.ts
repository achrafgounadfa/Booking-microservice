export interface UserProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  language: 'fr' | 'en';
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  preferences?: {
    eventTypes: string[];
    notifications: {
      email: boolean;
      sms: boolean;
    }
  };
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: string;
  profile: UserProfileDto;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
  role: string;
}
