export interface Hotel {
  id: string;
  title: string;
  description: string;
}

export interface HotelRoom {
  id: string;
  description: string;
  images: string[];
  hotel: Hotel;
}

export interface CreateHotelForm {
  title: string;
  description: string;
}

export interface CreateHotelRoomForm {
  hotel: string;
  description?: string;
  images?: File[];
  isEnabled?: boolean;
}

export const limit: number = 10;
export const offset: number = 0;

export const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
