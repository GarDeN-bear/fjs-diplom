import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

import { VITE_BACKEND_URL } from "../../../utils/utils";
import { useAuth } from "../auth/AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  subscribeToEvent: (event: string, handler: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user._id.length === 0) return;

    const newSocket = io(VITE_BACKEND_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: true,
      auth: {
        userId: user._id,
        role: user.role,
      },
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const subscribeToEvent = useCallback(
    (event: string, handler: (data: any) => void) => {
      if (socket) {
        socket.on(event, handler);
        return () => {
          socket.off(event, handler);
        };
      }
      return () => {};
    },
    [socket]
  );

  const value: SocketContextType = {
    socket,
    isConnected,
    subscribeToEvent,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
