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

const user = JSON.parse(localStorage.getItem("user"));
const CURRENT_USER_ID = user?.id;
const CURRENT_USER_EMAIL = user?.email;

const socket = io("http://localhost:3002");

function ChatApp() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [input, setInput] = useState("");
  //  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchGroups = async () => {
    const res = await fetch(
      `http://localhost:3002/chat/user/${CURRENT_USER_ID}/groups`
    );
    const data = await res.json();
    setGroups(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3002/auth/users");
    const data = await res.json();
    const filtered = data.filter((u) => u.id !== CURRENT_USER_ID);
    setUsers(filtered);
  };

  useEffect(() => {
    if (!CURRENT_USER_ID) {
      alert("Please login first");
      return;
    }
    fetchGroups();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    socket.connect();

    if (selectedChat.isGroup) {
      socket.emit("joinRoom", selectedChat.id);
      socket.emit("loadHistory", selectedChat.id);
    } else {
      socket.emit("joinPrivateRoom", CURRENT_USER_ID);
      socket.emit("loadPrivateHistory", {
        senderId: CURRENT_USER_ID,
        receiverId: selectedChat.id,
      });
    }

  

    socket.on("messageHistory", (msgs) => setMessages(msgs));
    socket.on("groupMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("privateMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("messageHistory");
      socket.off("groupMessage");
      socket.off("privateMessage");
      socket.disconnect();
      setMessages([]);
    };
  }, [selectedChat]);

    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append("image", file);
      setUploading(true);
      try {
        const res = await fetch("http://localhost:3002/chat/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        return data.url;
      } catch {
        alert("Image upload failed");
        return null;
      } finally {
        setUploading(false);
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

  
 const extractFirstUrl = (text) => {
   const urlRegex = /(https?:\/\/[^\s]+)/g;
   const urls = text?.match(urlRegex);
   return urls?.[0] ?? null;
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
      content: input.trim(),
      replyToMessageId: replyTo?.id,
      type: selectedImage ? "image" : "text",
      image: imageUrl || null,
    };


    
    setSelectedImage(null);
    setImagePreview(null);

    console.log("Payload:", payload);

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

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getInitials = (email) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const getRepliedMessage = (replyToMessage) => {
    return messages.find((msg) => msg.id === replyToMessage?.id);
  };

  const getLastMessage = (chat) => {
    // This would typically come from your API
    return "Last message preview...";
  };

  if (showCreateGroup) {
    return <CreateGroup onBack={() => setShowCreateGroup(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-green-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-semibold">
                {getInitials(CURRENT_USER_EMAIL)}
              </div>
              <div>
                <h1 className="text-lg font-semibold">Chats</h1>
                <p className="text-sm text-green-100">{CURRENT_USER_EMAIL}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-2 hover:bg-green-700 rounded-full transition-colors"
              >
                <Plus size={20} />
              </button>
              <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-green-200"
              size={16}
            />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-green-700 text-white placeholder-green-200 rounded-lg border-none outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Groups */}
          {groups.length > 0 && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Groups
              </h3>
              {groups.map((group) => (
                <div
                  key={`group-${group.id}`}
                  onClick={() => setSelectedChat({ ...group, isGroup: true })}
                  className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${
                    selectedChat?.id === group.id && selectedChat?.isGroup
                      ? "bg-green-50 border-r-4 border-green-600"
                      : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {group.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {getLastMessage(group)}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">12:30</div>
                </div>
              ))}
            </div>
          )}

          {/* Direct Messages */}
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Direct Messages
            </h3>
            {users.map((u) => (
              <div
                key={`user-${u.id}`}
                onClick={() => setSelectedChat({ ...u, isGroup: false })}
                className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${
                  selectedChat?.id === u.id && !selectedChat?.isGroup
                    ? "bg-green-50 border-r-4 border-green-600"
                    : ""
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 font-semibold text-blue-600">
                  {getInitials(u.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {u.email.split("@")[0]}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {getLastMessage(u)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400 mb-1">12:30</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                    getInitials(selectedChat.email)
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedChat.isGroup
                      ? selectedChat.name
                      : selectedChat.email.split("@")[0]}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.isGroup
                      ? `${
                          groups.find((g) => g.id === selectedChat.id)
                            ?.memberCount || 0
                        } members`
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

                        {/* Reply indicator */}
                        {/* {msg.replyTo && (
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
                              {msg.replyTo.senderEmail.split("@")[0]}
                            </p>
                            <p
                              className={`text-xs ${
                                msg.senderId === CURRENT_USER_ID
                                  ? "text-green-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {msg.replyTo.type === "image"
                                ? "📷 Image"
                                : msg.replyTo.content}
                            </p>
                          </div>
                        )} */}

                        {msg.replyTo &&
                          (() => {
                            const original = messages.find(
                              (m) => m.id === msg.replyTo
                            );
                            if (!original) return null;
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
                                  {original.senderEmail.split("@")[0]}
                                </p>
                                <p
                                  className={`text-xs ${
                                    msg.senderId === CURRENT_USER_ID
                                      ? "text-green-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {original.type === "image"
                                    ? "📷 Image"
                                    : original.content}
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
                        className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-all"
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
                    onChange={(e) => setInput(e.target.value)}
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

function CreateGroup({ onBack }) {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3002/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((u) => u.id !== currentUser?.id);
        setAllUsers(filtered);
      });
  }, []);

  const handleSubmit = async () => {
    if (!groupName || participants.length === 0) return;

    const allParticipants = [...participants, currentUser.id];
    console.log("All Participants:", allParticipants);

    const response = await fetch("http://localhost:3002/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: groupName,
        creatorId: currentUser.id,
        participantIds: allParticipants,
      }),
    });

    if (response.ok) {
      onBack();
    }
  };

  const toggleParticipant = (id) => {
    setParticipants((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const getInitials = (email) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="p-6 bg-green-600 text-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-semibold">Create New Group</h2>
              <p className="text-sm text-green-100">
                Add participants and create group
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Add Participants ({participants.length} selected)
            </label>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    participants.includes(user.id)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleParticipant(user.id)}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 font-semibold text-blue-600">
                    {getInitials(user.email)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {user.email.split("@")[0]}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={participants.includes(user.id)}
                    onChange={() => toggleParticipant(user.id)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleSubmit}
            disabled={!groupName || participants.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;