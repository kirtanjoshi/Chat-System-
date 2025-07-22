import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Search,
  Send,
  Plus,
  Users,
  MessageCircle,
  Settings,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Reply,
  X,
  Image,
  File,
} from "lucide-react";

import LinkPreviewComponent from "../auth/link-preview";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import { formatTime, extractFirstUrl, getInitials } from "../utils/helper";
import { useChatSocket } from "../hook/useChatSocket";



import CreateGroup from "./CreateGroup";

const user = JSON.parse(localStorage.getItem("user"));
// console.log("Current user:", user);
const CURRENT_USER_ID = user?.id;
const CURRENT_USER_EMAIL = user?.email;


function ChatApp() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setTyping] = useState(false);
  // const [uploading, setUploading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


const BASE_URL = "http://localhost:3002";
  const { socket, messages, onlineUsers, typingUsers } =
    useChatSocket(CURRENT_USER_ID, selectedChat);

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!isTyping) {
      setTyping(true);
      socket.emit("userTyping", {
        roomId: selectedChat?.id,
        senderId: CURRENT_USER_ID,
        isGroup: selectedChat?.isGroup,
      });
    }

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit("userStopTyping", {
        roomId: selectedChat?.id,
        senderId: CURRENT_USER_ID,
        isGroup: selectedChat?.isGroup,
      });
    }, 1000);
  };


  const fetchGroupParticipants = async (roomId) => {
    const res = await fetch(`${BASE_URL}/chat/${roomId}`);
console.log("Fetching participants for room:", roomId);
    const data = await res.json();

    console.log("Participants data:", data);
    setParticipants(data)
    return data;
  };

  const fetchGroups = async () => {
    const res = await fetch(
      `${BASE_URL}/chat/user/${CURRENT_USER_ID}/groups`
    );

    const data = await res.json();  
    setGroups(data);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/auth/users`);
    const data = await res.json();
    const filtered = data.filter((u) => u.id !== CURRENT_USER_ID);
    setUsers(filtered);
  };


  useEffect(() => {
    if (selectedChat?.isGroup) {
      fetchGroupParticipants(selectedChat?.id);
    } else {
      setParticipants([]);
    }
   
  }, [selectedChat]);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }
  
    fetchGroups();
    fetchUsers();
  }, []);

  // }

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    // setUploading(true);
    try {
      const res = await fetch(`${BASE_URL}/chat/upload-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.url;
    } catch {
      alert("Image upload failed");
      return null;
    } finally {
      // setUploading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    let imageUrl = null;
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
      if (!imageUrl) return; // stop if upload failed
    }

    const payload = {
      senderId: CURRENT_USER_ID,
      senderEmail: CURRENT_USER_EMAIL,
      senderEmailProfilePic: user?.profilePicture,
      content: input.trim(),
      replyToMessageId: replyTo?.id,
      type: selectedImage ? "image" : "text",
      image: imageUrl || null,
    };

    console.log("Its cuurent email", CURRENT_USER_EMAIL);

    setSelectedImage(null);
    setImagePreview(null);

    console.log("Payload:", payload);
    // React logout function

    if (selectedChat.isGroup) {
      socket.emit("sendGroupMessage", { ...payload, roomId: selectedChat.id });
    } else {
      socket.emit("sendPrivateMessage", {
        ...payload,
        receiverId: selectedChat.id,
        receiverEmail: selectedChat.email,
      });
    }

    setReplyTo(null);
    setInput("");
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  // const getRepliedMessage = (replyToMessage) => {
  //   return messages.find((msg) => msg.id === replyToMessage?.id);
  // };

  // const getLastMessage = (chat) => {
  //   // This would typically come from your API
  //   return "Last message preview...";
  // };

  if (showCreateGroup) {
    return <CreateGroup onBack={() => setShowCreateGroup(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        user={user}
        users={users}
        groups={groups}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        showCreateGroup={showCreateGroup}
        setShowCreateGroup={setShowCreateGroup}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onlineUsers={onlineUsers}
        logout={logout}
      />
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    selectedChat.isGroup
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {selectedChat.isGroup ? (
                    <Users size={20} />
                  ) : (
                    getInitials(selectedChat?.email)
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedChat.isGroup
                      ? selectedChat.name
                      : selectedChat.email.split("@")[0]}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.isGroup == true
                      ? `${participants.length} members`
                      : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === CURRENT_USER_ID
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                    {msg.senderId !== CURRENT_USER_ID && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                        {getInitials(msg.senderEmail)}

                        {/* {user?.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(user?.email)
                            )} */}
                      </div>
                    )}

                    <div className="relative group">
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md break-words ${
                          msg.senderId === CURRENT_USER_ID
                            ? "bg-green-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                        }`}
                      >
                        {msg.senderId !== CURRENT_USER_ID &&
                          selectedChat.isGroup && (
                            <p className="text-xs font-medium mb-1 opacity-75">
                              {msg.senderEmail.split("@")[0]}
                            </p>
                          )}

                        {msg.replyToMessageId &&
                          (() => {
                            const originalMessage = messages.find(
                              (m) => m.id === msg.replyToMessageId
                            );
                            if (!originalMessage) return null;

                            return (
                              <div
                                className={`p-2 mb-2 rounded-lg border-l-4 ${
                                  msg.senderId === CURRENT_USER_ID
                                    ? "bg-green-600 border-green-300"
                                    : "bg-gray-100 border-gray-400"
                                }`}
                              >
                                <p
                                  className={`text-xs font-medium ${
                                    msg.senderId === CURRENT_USER_ID
                                      ? "text-green-100"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {originalMessage.senderEmail.split("@")[0]}
                                </p>
                                <p
                                  className={`text-xs ${
                                    msg.senderId === CURRENT_USER_ID
                                      ? "text-green-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {originalMessage.type === "image"
                                    ? "📷 Image"
                                    : originalMessage.content}
                                </p>
                              </div>
                            );
                          })()}

                        {/* Message content */}

                        <div className="space-y-2">
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Shared image"
                              className="max-w-full h-auto rounded-lg"
                            />
                          )}
                          {msg.content && (
                            <>
                              <p className="break-words whitespace-pre-wrap leading-relaxed">
                                {msg.content}
                              </p>
                              <LinkPreviewComponent
                                url={extractFirstUrl(msg.content)}
                              />
                            </>
                          )}
                        </div>

                        <div
                          className={`text-xs mt-1 ${
                            msg.senderId === CURRENT_USER_ID
                              ? "text-green-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>

                      {/* Reply button */}
                      <button
                        onClick={() => handleReply(msg)}
                        className={`absolute top-2 opacity-0 group-hover:opacity-100 p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-all ${
                          msg.senderId === CURRENT_USER_ID
                            ? "-left-8"
                            : "-right-8"
                        }`}
                      >
                        <Reply size={14} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Preview */}
            {replyTo && (
              <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Reply size={16} className="text-yellow-600" />
                    {/* <span className="text-sm font-medium text-yellow-800">
                          Replying to {replyTo.senderEmail.split("@")[0]}
                        </span> */}

                    <span className="text-sm font-medium text-yellow-800">
                      Replying to{" "}
                      {replyTo.senderId === CURRENT_USER_ID
                        ? "yourself"
                        : replyTo.senderEmail.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="p-1 hover:bg-yellow-200 rounded-full transition-colors"
                  >
                    <X size={16} className="text-yellow-600" />
                  </button>
                </div>
                <p className="text-sm text-yellow-700 mt-1 truncate">
                  {replyTo.type === "image" ? "📷 Image" : replyTo.content}
                </p>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Image selected: {selectedImage?.name}
                    </span>
                  </div>
                  <button
                    onClick={clearImageSelection}
                    className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                  >
                    <X size={16} className="text-blue-600" />
                  </button>
                </div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-w-32 h-auto rounded-lg"
                />
              </div>
            )}
            {selectedChat &&
              [...typingUsers].some((id) => id !== CURRENT_USER_ID) && (
                <div className="px-4 py-2 text-sm text-gray-500 italic">
                  {selectedChat.isGroup
                    ? "Someone"
                    : selectedChat.email.split("@")[0]}{" "}
                  is typing...
                </div>
              )}
            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Image size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Plus size={20} className="text-gray-600" />
                </button>

                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <input
                    type="text"
                    value={input}
                    // onChange={((e) => setInput(e.target.value), handleTyping(e))}
                    onChange={(e) => handleTyping(e)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  />

                  <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <Smile size={18} className="text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
