export interface Hotel {
  _id: string;
  title: string;
  description: string;
}

export interface HotelRoom {
  _id: string;
  description: string;
  images: string[] | FileList;
  hotel: string;
}

export interface CreateReservation {
  userId: string;
  hotelId: string;
  roomId: string;
  dateStart: Date;
  dateEnd: Date;
}

export const limit: number = 1000;
export const offset: number = 0;
export const itemsOnPage: number = 10;

export const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export enum DayOfMonth {
  PreviousMonth,
  CurrentMonth,
  NextMonth,
}
