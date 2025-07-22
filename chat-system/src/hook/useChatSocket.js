// hooks/useChatSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useChatSocket(userId, selectedChat) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:3002", { auth: { userId } });
    setSocket(socket);

    socket.on("connect", () => console.log("Connected", socket.id));

    socket.on("userOnline", (ids) => setOnlineUsers(new Set(ids)));

    socket.on("userTyping", ({ senderId }) => {
      if (senderId !== userId) {
        setTypingUsers((prev) => new Set(prev).add(senderId));
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(senderId);
        return updated;
      });
    });

    if (selectedChat) {
      if (selectedChat.isGroup) {
        socket.emit("joinRoom", selectedChat.id);
        socket.emit("loadHistory", selectedChat.id);
      } else {
        socket.emit("joinPrivateRoom", userId);
        socket.emit("loadPrivateHistory", {
          senderId: userId,
          receiverId: selectedChat.id,
        });
      }

      socket.on("messageHistory", (msgs) => setMessages(msgs));
      socket.on("groupMessage", (msg) => setMessages((prev) => [...prev, msg]));
      socket.on("privateMessage", (msg) =>
        setMessages((prev) => [...prev, msg])
      );
    }

    return () => {
      socket.off("messageHistory");
      socket.off("groupMessage");
      socket.off("privateMessage");
      socket.disconnect();
      setMessages([]);
      setTypingUsers(new Set());
    };
  }, [userId, selectedChat]);

  return { socket, messages, setMessages, onlineUsers, typingUsers };
}
