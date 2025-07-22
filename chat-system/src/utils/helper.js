export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getInitials = (email) => {
  if (!email || typeof email !== "string" || !email.includes("@")) return "??";
  return email.split("@")[0].substring(0, 2).toUpperCase();
};

export const extractFirstUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text?.match(urlRegex);
  return urls?.[0] ?? null;
};
