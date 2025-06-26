export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  registration_date?: string;
}

export interface FestiveEvent {
  id?: number;
  event_name: string;
  event_date: string;
  event_address: string;
  event_description?: string;
  image_url?: string;
  user_id: number;
  created_at?: string;
  user?: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

