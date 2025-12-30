export interface Hotel {
  _id: string;
  title: string;
  description: string;
}

export const emptyHotel: Hotel = {
  _id: "",
  title: "",
  description: "",
};

export interface HotelRoom {
  _id: string;
  description: string;
  images: (string | File)[];
  hotel: string;
}

export const emptyRoom: HotelRoom = {
  _id: "",
  description: "",
  images: [],
  hotel: "",
};

export interface CreateReservation {
  userId: string;
  hotelId: string;
  roomId: string;
  dateStart: Date;
  dateEnd: Date;
}

export enum Role {
  Common = "common",
  Client = "client",
  Admin = "admin",
  Manager = "manager",
}

export interface User {
  _id: string;
  email: string;
  password?: string;
  name: string;
  contactPhone?: string;
  role?: string;
}

export interface Message {
  _id: string;
  author: string;
  text: string;
  sentAt: Date;
  readAt: Date;
}

export interface SupportRequest {
  _id: string;
  user: string;
  messages: Message[];
  isActive?: boolean;
  hasNewMessages?: boolean;
}

export const emptySupportRequest: SupportRequest = {
  _id: "",
  user: "",
  messages: [],
};

export interface CreateSupportRequest {
  user: string;
  text: string;
}

export interface CreateMessageRequest {
  author: string;
  supportRequest: string;
  text: string;
  readAt?: Date;
}

export interface MessageResponce {
  supportRequest: string;
  message: Message;
}

export const emptyCreateMessageRequest: CreateMessageRequest = {
  author: "",
  supportRequest: "",
  text: "",
};

export const emptyUser: User = {
  _id: "",
  email: "",
  password: "",
  name: "",
  contactPhone: "",
  role: Role.Common,
};

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

export const getImageUrl = (image: string | File): string => {
  if (typeof image === "string") {
    return `${VITE_BACKEND_URL}/public/${image}`;
  } else {
    return URL.createObjectURL(image);
  }
};

export const scrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToTop);
  });
};
