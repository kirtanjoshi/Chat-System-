
//     // import React, { useEffect, useState, useRef } from "react";
//     // import { io } from "socket.io-client";
//     // import LinkPreviewComponent from "./auth/link-preview";
//     // import { Send, Paperclip, Upload, X, Users, CornerUpLeft } from "lucide-react";

//     // const socket = io("http://localhost:3002");

//     // const ChatComponent = ({
//     //   senderId,
//     //   receiverId,
//     //   senderEmail,
//     //   receiverEmail,
//     // }) => {
//     //   const [message, setMessage] = useState("");
//     //   const [chat, setChat] = useState([]);
//     //   const [image, setImage] = useState(null);
//     //   const [uploading, setUploading] = useState(false);
//     //   const [showFileUpload, setShowFileUpload] = useState(false);
//     //   const [replyTo, setReplyTo] = useState(null);
//     //   const [activeTab, setActiveTab] = useState("Messages");






//     //   const chatEndRef = useRef(null);
//     //   const fileInputRef = useRef(null);
//     //   const messageRefs = useRef({});

//     //   const getInitials = (email) =>
//     //     email ? email.split("@")[0].charAt(0).toUpperCase() : "U";

//     //   const getUserColor = (email) => {
//     //     const colors = [
//     //       "bg-orange-500",
//     //       "bg-purple-500",
//     //       "bg-green-500",
//     //       "bg-blue-500",
//     //       "bg-pink-500",
//     //       "bg-indigo-500",
//     //     ];
//     //     const hash = email?.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
//     //     return colors[hash % colors.length];
//     //   };

//     //   const extractFirstUrl = (text) => {
//     //     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     //     const urls = text?.match(urlRegex);
//     //     return urls?.[0] ?? null;
//     //   };

//     //   const formatTime = (timestamp) => {
//     //     const date = new Date(timestamp || Date.now());
//     //     const now = new Date();
//     //     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     //     const messageDate = new Date(
//     //       date.getFullYear(),
//     //       date.getMonth(),
//     //       date.getDate()
//     //     );

//     //     if (messageDate.getTime() === today.getTime()) {
//     //       return date.toLocaleTimeString([], {
//     //         hour: "2-digit",
//     //         minute: "2-digit",
//     //       });
//     //     } else {
//     //       return (
//     //         date.toLocaleDateString([], { month: "short", day: "numeric" }) +
//     //         " " +
//     //         date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     //       );
//     //     }
//     //   };

//     //   const formatMessageTime = (timestamp) => {
//     //     const date = new Date(timestamp || Date.now());
//     //     const now = new Date();
//     //     const diffInHours = (now - date) / (1000 * 60 * 60);

//     //     if (diffInHours < 1) {
//     //       return "Just now";
//     //     } else if (diffInHours < 24) {
//     //       return date.toLocaleTimeString([], {
//     //         hour: "2-digit",
//     //         minute: "2-digit",
//     //       });
//     //     } else {
//     //       return (
//     //         date.toLocaleDateString([], { month: "short", day: "numeric" }) +
//     //         ", " +
//     //         date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     //       );
//     //     }
//     //   };

//     //   useEffect(() => {
//     //     if (!senderId || !receiverId) return;

//     //     socket.emit("loadHistory", { senderId, receiverId });

//     //     socket.on("messageHistory", (messages) => {
//     //       setChat(messages);
//     //     });

//     //     socket.on("receiveMessage", (msg) => {
//     //       setChat((prev) => [...prev, msg]);
//     //     });

//     //     return () => {
//     //       socket.off("messageHistory");
//     //       socket.off("receiveMessage");
//     //     };
//     //   }, [senderId, receiverId]);

//     //   useEffect(() => {
//     //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     //   }, [chat]);

//     //   const uploadImage = async (file) => {
//     //     const formData = new FormData();
//     //     formData.append("image", file);
//     //     setUploading(true);
//     //     try {
//     //       const res = await fetch("http://localhost:3002/chat/upload-image", {
//     //         method: "POST",
//     //         body: formData,
//     //       });
//     //       const data = await res.json();
//     //       return data.url;
//     //     } catch {
//     //       alert("Image upload failed");
//     //       return null;
//     //     } finally {
//     //       setUploading(false);
//     //     }
//     //   };

//     //   const  sendPrivateMessage = async () => {
//     //     if (!message.trim() && !image) return;

//     //     let imageUrl = null;
//     //     if (image) {
//     //       imageUrl = await uploadImage(image);
//     //       if (!imageUrl) return;
//     //     }

//     //     socket.emit(" sendPrivateMessage", {
//     //       senderId,
//     //       receiverId,
//     //       senderEmail,
//     //       receiverEmail,
//     //       content: message,
//     //       image: imageUrl,
//     //       replyToMessageId: replyTo,
//     //     });

//     //     setMessage("");
//     //     setImage(null);
//     //     setReplyTo(null);
//     //     setShowFileUpload(false);
//     //   };

//     //   const handleKeyPress = (e) => {
//     //     if (e.key === "Enter" && !e.shiftKey) {
//     //       e.preventDefault();
//     //        sendPrivateMessage();
//     //     }
//     //   };

//     //   const scrollToMessage = (id) => {
//     //     messageRefs.current[id]?.scrollIntoView({
//     //       behavior: "smooth",
//     //       block: "center",
//     //     });
//     //     messageRefs.current[id]?.classList.add("ring-2", "ring-teal-400");
//     //     setTimeout(() => {
//     //       messageRefs.current[id]?.classList.remove("ring-2", "ring-teal-400");
//     //     }, 1000);
//     //   };

//     //   return (
//     //     <div className="flex flex-col h-screen bg-gray-100">
//     //       {/* Header */}
//     //       <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
//     //         <div className="flex items-center gap-3">
//     //           <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
//     //             <Users className="text-white w-4 h-4" />
//     //           </div>
//     //           <h1 className="text-lg font-medium text-gray-900">Group Chat</h1>
//     //         </div>

//     //         <div className="flex bg-gray-100 rounded-lg p-1">
//     //           <button
//     //             onClick={() => setActiveTab("Messages")}
//     //             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//     //               activeTab === "Messages"
//     //                 ? "bg-teal-500 text-white shadow-sm"
//     //                 : "text-gray-600 hover:text-gray-900"
//     //             }`}
//     //           >
//     //             Messages
//     //           </button>
//     //           <button
//     //             onClick={() => setActiveTab("Participants")}
//     //             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//     //               activeTab === "Participants"
//     //                 ? "bg-teal-500 text-white shadow-sm"
//     //                 : "text-gray-600 hover:text-gray-900"
//     //             }`}
//     //           >
//     //             Participants
//     //           </button>
//     //         </div>
//     //       </div>

//     //       {/* Messages */}
//     //       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//     //         {chat.length === 0 && (
//     //           <div className="text-center text-gray-500 mt-8">
//     //             No messages yet. Start the conversation!
//     //           </div>
//     //         )}

//     //         {chat.map((msg, index) => {
//     //           const isCurrentUser = msg.senderEmail === senderEmail;
//     //           const showAvatar =
//     //             index === 0 || chat[index - 1].senderEmail !== msg.senderEmail;
//     //           const showName = showAvatar; // Show name for all new message groups

//     //           return (
//     //             <div key={msg.id || index} className="space-y-2">
//     //               {/* Sender name and timestamp */}
//     //               {showName && (
//     //                 <div
//     //                   className={`flex items-center gap-2 ${
//     //                     isCurrentUser ? "justify-end mr-12" : "ml-12"
//     //                   }`}
//     //                 >
//     //                   <span className="text-sm font-medium text-gray-900">
//     //                     {isCurrentUser
//     //                       ? "You"
//     //                       : msg.senderEmail?.split("@")[0] || "User"}
//     //                   </span>
//     //                   <span className="text-xs text-gray-500">
//     //                     {formatMessageTime(msg.timestamp)}
//     //                   </span>
//     //                 </div>
//     //               )}

//     //               <div
//     //                 ref={(el) => (messageRefs.current[msg.id] = el)}
//     //                 className={`flex ${
//     //                   isCurrentUser ? "justify-end" : "justify-start"
//     //                 } group`}
//     //               >
//     //                 {/* Avatar for other users */}
//     //                 {!isCurrentUser && (
//     //                   <div className="flex-shrink-0 mr-3">
//     //                     {showAvatar ? (
//     //                       <div
//     //                         className={`w-8 h-8 rounded-full flex items-center justify-center ${getUserColor(
//     //                           senderEmail
//     //                         )}`}
//     //                       >
//     //                         <span className="text-white font-medium text-xs">
//     //                           {getInitials(senderEmail)}
//     //                         </span>
//     //                       </div>
//     //                     ) : (
//     //                       <div className="w-8 h-8" />
//     //                     )}
//     //                   </div>
//     //                 )}

//     //                 {/* Message bubble */}
//     //                 <div className="relative max-w-md">
//     //                   <div
//     //                     className={`px-4 py-2 rounded-2xl text-sm transition-all ${
//     //                       isCurrentUser
//     //                         ? "bg-teal-500 text-white rounded-br-md"
//     //                         : "bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100"
//     //                     }`}
//     //                   >
//     //                     {/* Reply Preview */}
//     //                     {msg.replyToMessageId && (
//     //                       <div
//     //                         onClick={() => scrollToMessage(msg.replyToMessageId)}
//     //                         className={`text-xs mb-2 p-2 rounded-lg border-l-2 cursor-pointer ${
//     //                           isCurrentUser
//     //                             ? "bg-teal-600 border-teal-300 text-teal-100"
//     //                             : "bg-gray-50 border-gray-300 text-gray-500"
//     //                         }`}
//     //                       >
//     //                         <span className="opacity-70">Replying to:</span>
//     //                         <div className="truncate font-medium">
//     //                           {chat.find((m) => m.id === msg.replyToMessageId)
//     //                             ?.content || "Message"}
//     //                         </div>
//     //                       </div>
//     //                     )}

//     //                     {msg.content && (
//     //                       <>
//     //                         <p className="break-words whitespace-pre-wrap leading-relaxed">
//     //                           {msg.content}
//     //                         </p>
//     //                         <LinkPreviewComponent
//     //                           url={extractFirstUrl(msg.content)}
//     //                         />
//     //                       </>
//     //                     )}

//     //                     {msg.image && (
//     //                       <img
//     //                         src={msg.image}
//     //                         alt="chat"
//     //                         className="rounded-xl mt-2 max-w-full"
//     //                       />
//     //                     )}
//     //                   </div>

//     //                   {/* Reply button */}
//     //                   <button
//     //                     className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-100 hover:bg-gray-200"
//     //                     onClick={() => setReplyTo(msg.id)}
//     //                   >
//     //                     <CornerUpLeft className="w-3 h-3 text-gray-600" />
//     //                   </button>
//     //                 </div>

//     //                 {/* Avatar for current user */}
//     //                 {isCurrentUser && (
//     //                   <div className="flex-shrink-0 ml-3">
//     //                     {showAvatar ? (
//     //                       <div
//     //                         className={`w-8 h-8 rounded-full flex items-center justify-center ${getUserColor(
//     //                           senderEmail
//     //                         )}`}
//     //                       >
//     //                         <span className="text-white font-medium text-xs">
//     //                           {getInitials(senderEmail)}
//     //                         </span>
//     //                       </div>
//     //                     ) : (
//     //                       <div className="w-8 h-8" />
//     //                     )}
//     //                   </div>
//     //                 )}
//     //               </div>
//     //             </div>
//     //           );
//     //         })}
//     //         <div ref={chatEndRef} />
//     //       </div>

//     //       {/* File Upload Modal */}
//     //       {showFileUpload && (
//     //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//     //           <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
//     //             <div className="text-center space-y-4">
//     //               <Upload className="w-12 h-12 text-gray-400 mx-auto" />
//     //               <h3 className="font-medium text-gray-900">Upload Image</h3>
//     //               <input
//     //                 ref={fileInputRef}
//     //                 type="file"
//     //                 accept="image/*"
//     //                 onChange={(e) => {
//     //                   setImage(e.target.files[0]);
//     //                   setShowFileUpload(false);
//     //                 }}
//     //                 className="hidden"
//     //               />
//     //               <div className="space-y-2">
//     //                 <button
//     //                   onClick={() => fileInputRef.current?.click()}
//     //                   className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
//     //                 >
//     //                   Choose File
//     //                 </button>
//     //                 <button
//     //                   onClick={() => setShowFileUpload(false)}
//     //                   className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//     //                 >
//     //                   Cancel
//     //                 </button>
//     //               </div>
//     //             </div>
//     //           </div>
//     //         </div>
//     //       )}

//     //       {/* Input Area */}
//     //       <div className="bg-white border-t border-gray-200 p-4 space-y-3">
//     //         {replyTo && (
//     //           <div className="bg-gray-50 text-gray-700 text-sm px-3 py-2 rounded-xl flex justify-between items-center">
//     //             <span className="truncate">
//     //               Replying to:{" "}
//     //               {chat.find((msg) => msg.id === replyTo)?.content ||
//     //                 "Previous message"}
//     //             </span>
//     //             <button
//     //               onClick={() => setReplyTo(null)}
//     //               className="text-gray-400 hover:text-gray-600 ml-2"
//     //             >
//     //               <X className="w-4 h-4" />
//     //             </button>
//     //           </div>
//     //         )}

//     //         <div className="flex items-center gap-3">
//     //           {image && (
//     //             <div className="bg-gray-50 px-3 py-2 rounded-xl flex items-center gap-2">
//     //               <span className="text-sm text-gray-600 truncate max-w-32">
//     //                 {image.name}
//     //               </span>
//     //               <button
//     //                 onClick={() => setImage(null)}
//     //                 className="text-gray-400 hover:text-gray-600"
//     //               >
//     //                 <X className="w-4 h-4" />
//     //               </button>
//     //             </div>
//     //           )}

//     //           <input
//     //             value={message}
//     //             onChange={(e) => setMessage(e.target.value)}
//     //             onKeyPress={handleKeyPress}
//     //             placeholder="Write your message..."
//     //             className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
//     //           />

//     //           <button
//     //             onClick={() => setShowFileUpload(true)}
//     //             className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//     //           >
//     //             <Paperclip className="w-5 h-5" />
//     //           </button>

//     //           <button
//     //             onClick={ sendPrivateMessage}
//     //             disabled={uploading || (!message.trim() && !image)}
//     //             className="bg-teal-500 text-white p-3 rounded-full disabled:opacity-50 hover:bg-teal-600 transition-colors shadow-lg"
//     //           >
//     //             {uploading ? (
//     //               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//     //             ) : (
//     //               <Send className="w-4 h-4" />
//     //             )}
//     //           </button>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   );
//     // };

// // export default ChatComponent;
    



// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import LinkPreviewComponent from "./auth/link-preview";
// import {
//   Send,
//   Paperclip,
//   Upload,
//   X,
//   Users,
//   CornerUpLeft,
//   Plus,
//   Settings,
//   Search,
//   UserPlus,
// } from "lucide-react";

// const socket = io("http://localhost:3002");

// const ChatComponent = ({
//   senderId,
//   receiverId,
//   senderEmail,
//   receiverEmail,
//   isGroupChat = false,
//   groupId = null,
//   groupName = "Group Chat",
//   groupMembers = [],
// }) => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [showFileUpload, setShowFileUpload] = useState(false);
//   const [replyTo, setReplyTo] = useState(null);
//   const [activeTab, setActiveTab] = useState("Messages");
//   const [showGroupSettings, setShowGroupSettings] = useState(false);
//   const [showAddMember, setShowAddMember] = useState(false);
//   const [newMemberEmail, setNewMemberEmail] = useState("");
//   const [onlineMembers, setOnlineMembers] = useState([]);

//   const chatEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const messageRefs = useRef({});

//   const getInitials = (email) =>
//     email ? email.split("@")[0].charAt(0).toUpperCase() : "U";

//   const getUserColor = (email) => {
//     const colors = [
//       "bg-orange-500",
//       "bg-purple-500",
//       "bg-green-500",
//       "bg-blue-500",
//       "bg-pink-500",
//       "bg-indigo-500",
//       "bg-rose-500",
//       "bg-cyan-500",
//       "bg-amber-500",
//       "bg-emerald-500",
//     ];
//     const hash = email?.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
//     return colors[hash % colors.length];
//   };

//   const extractFirstUrl = (text) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     const urls = text?.match(urlRegex);
//     return urls?.[0] ?? null;
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp || Date.now());
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const messageDate = new Date(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate()
//     );

//     if (messageDate.getTime() === today.getTime()) {
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } else {
//       return (
//         date.toLocaleDateString([], { month: "short", day: "numeric" }) +
//         " " +
//         date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       );
//     }
//   };

//   const formatMessageTime = (timestamp) => {
//     const date = new Date(timestamp || Date.now());
//     const now = new Date();
//     const diffInHours = (now - date) / (1000 * 60 * 60);

//     if (diffInHours < 1) {
//       return "Just now";
//     } else if (diffInHours < 24) {
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } else {
//       return (
//         date.toLocaleDateString([], { month: "short", day: "numeric" }) +
//         ", " +
//         date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       );
//     }
//   };

//   useEffect(() => {
//     if (isGroupChat && groupId) {
//       // Group chat logic
//       socket.emit("joinGroup", { groupId, userId: senderId });
//       socket.emit("loadGroupHistory", { groupId });

//       socket.on("groupMessageHistory", (messages) => {
//         setChat(messages);
//       });

//       socket.on("receiveGroupMessage", (msg) => {
//         setChat((prev) => [...prev, msg]);
//       });

//       socket.on("groupMembersUpdate", (members) => {
//         setOnlineMembers(members);
//       });

//       return () => {
//         socket.off("groupMessageHistory");
//         socket.off("receiveGroupMessage");
//         socket.off("groupMembersUpdate");
//       };
//     } else {
//       // Direct chat logic (existing)
//       if (!senderId || !receiverId) return;

//       socket.emit("loadHistory", { senderId, receiverId });

//       socket.on("messageHistory", (messages) => {
//         setChat(messages);
//       });

//       socket.on("receiveMessage", (msg) => {
//         setChat((prev) => [...prev, msg]);
//       });

//       return () => {
//         socket.off("messageHistory");
//         socket.off("receiveMessage");
//       };
//     }
//   }, [senderId, receiverId, isGroupChat, groupId]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const uploadImage = async (file) => {
//     const formData = new FormData();
//     formData.append("image", file);
//     setUploading(true);
//     try {
//       const res = await fetch("http://localhost:3002/chat/upload-image", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       return data.url;
//     } catch {
//       alert("Image upload failed");
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const  sendPrivateMessage = async () => {
//     if (!message.trim() && !image) return;

//     let imageUrl = null;
//     if (image) {
//       imageUrl = await uploadImage(image);
//       if (!imageUrl) return;
//     }

//     if (isGroupChat) {
//       socket.emit("sendGroupMessage", {
//         groupId,
//         senderId,
//         senderEmail,
//         content: message,
//         image: imageUrl,
//         replyToMessageId: replyTo,
//       });
//     } else {
//       socket.emit(" sendPrivateMessage", {
//         senderId,
//         receiverId,
//         senderEmail,
//         receiverEmail,
//         content: message,
//         image: imageUrl,
//         replyToMessageId: replyTo,
//       });
//     }

//     setMessage("");
//     setImage(null);
//     setReplyTo(null);
//     setShowFileUpload(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//        sendPrivateMessage();
//     }
//   };

//   const scrollToMessage = (id) => {
//     messageRefs.current[id]?.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//     messageRefs.current[id]?.classList.add("ring-2", "ring-teal-400");
//     setTimeout(() => {
//       messageRefs.current[id]?.classList.remove("ring-2", "ring-teal-400");
//     }, 1000);
//   };

//   const addMember = () => {
//     if (newMemberEmail.trim()) {
//       socket.emit("addGroupMember", {
//         groupId,
//         memberEmail: newMemberEmail.trim(),
//       });
//       setNewMemberEmail("");
//       setShowAddMember(false);
//     }
//   };

//   const renderParticipantsTab = () => (
//     <div className="p-4 space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="font-medium text-gray-900">
//           Participants ({groupMembers.length})
//         </h3>
//         <button
//           onClick={() => setShowAddMember(true)}
//           className="p-2 text-teal-500 hover:bg-teal-50 rounded-full transition-colors"
//         >
//           <UserPlus className="w-4 h-4" />
//         </button>
//       </div>

//       <div className="space-y-3">
//         {groupMembers.map((member, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
//           >
//             <div
//               className={`w-10 h-10 rounded-full flex items-center justify-center ${getUserColor(
//                 member.email
//               )}`}
//             >
//               <span className="text-white font-medium text-sm">
//                 {getInitials(member.email)}
//               </span>
//             </div>
//             <div className="flex-1">
//               <div className="font-medium text-gray-900">
//                 {member.email === senderEmail
//                   ? "You"
//                   : member.email.split("@")[0]}
//               </div>
//               <div className="text-sm text-gray-500">{member.email}</div>
//             </div>
//             <div
//               className={`w-2 h-2 rounded-full ${
//                 onlineMembers.includes(member.id)
//                   ? "bg-green-500"
//                   : "bg-gray-300"
//               }`}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div
//             className={`w-10 h-10 rounded-full flex items-center justify-center ${
//               isGroupChat
//                 ? "bg-gradient-to-br from-teal-500 to-cyan-500"
//                 : "bg-teal-500"
//             }`}
//           >
//             <Users className="text-white w-5 h-5" />
//           </div>
//           <div>
//             <h1 className="text-lg font-semibold text-gray-900">
//               {isGroupChat
//                 ? groupName
//                 : `Chat with ${receiverEmail?.split("@")[0]}`}
//             </h1>
//             {isGroupChat && (
//               <p className="text-sm text-gray-500">
//                 {groupMembers.length} members • {onlineMembers.length} online
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {isGroupChat && (
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setActiveTab("Messages")}
//                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                   activeTab === "Messages"
//                     ? "bg-white text-teal-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 Messages
//               </button>
//               <button
//                 onClick={() => setActiveTab("Participants")}
//                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                   activeTab === "Participants"
//                     ? "bg-white text-teal-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 Participants
//               </button>
//             </div>
//           )}

//           {isGroupChat && (
//             <button
//               onClick={() => setShowGroupSettings(true)}
//               className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <Settings className="w-5 h-5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       {activeTab === "Messages" ? (
//         <>
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chat.length === 0 && (
//               <div className="text-center text-gray-500 mt-8">
//                 <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                 <p className="text-lg font-medium mb-2">No messages yet</p>
//                 <p className="text-sm">Start the conversation!</p>
//               </div>
//             )}

//             {chat.map((msg, index) => {
//               const isCurrentUser = msg.senderEmail === senderEmail;
//               const showAvatar =
//                 index === 0 || chat[index - 1].senderEmail !== msg.senderEmail;
//               const showName = showAvatar && isGroupChat;

//               return (
//                 <div key={msg.id || index} className="space-y-2">
//                   {/* Sender name and timestamp */}
//                   {showName && (
//                     <div
//                       className={`flex items-center gap-2 ${
//                         isCurrentUser ? "justify-end mr-12" : "ml-12"
//                       }`}
//                     >
//                       <span className="text-sm font-medium text-gray-900">
//                         {isCurrentUser
//                           ? "You"
//                           : msg.senderEmail?.split("@")[0] || "User"}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {formatMessageTime(msg.timestamp)}
//                       </span>
//                     </div>
//                   )}

//                   <div
//                     ref={(el) => (messageRefs.current[msg.id] = el)}
//                     className={`flex ${
//                       isCurrentUser ? "justify-end" : "justify-start"
//                     } group`}
//                   >
//                     {/* Avatar for other users */}
//                     {!isCurrentUser && (
//                       <div className="flex-shrink-0 mr-3">
//                         {showAvatar ? (
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center ${getUserColor(
//                               msg.senderEmail
//                             )}`}
//                           >
//                             <span className="text-white font-medium text-xs">
//                               {getInitials(msg.senderEmail)}
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="w-8 h-8" />
//                         )}
//                       </div>
//                     )}

//                     {/* Message bubble */}
//                     <div className="relative max-w-md">
//                       <div
//                         className={`px-4 py-2 rounded-2xl text-sm transition-all ${
//                           isCurrentUser
//                             ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-md shadow-lg"
//                             : "bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100"
//                         }`}
//                       >
//                         {/* Reply Preview */}
//                         {msg.replyToMessageId && (
//                           <div
//                             onClick={() =>
//                               scrollToMessage(msg.replyToMessageId)
//                             }
//                             className={`text-xs mb-2 p-2 rounded-lg border-l-2 cursor-pointer ${
//                               isCurrentUser
//                                 ? "bg-white/20 border-white/50 text-white/90"
//                                 : "bg-gray-50 border-gray-300 text-gray-500"
//                             }`}
//                           >
//                             <span className="opacity-70">Replying to:</span>
//                             <div className="truncate font-medium">
//                               {chat.find((m) => m.id === msg.replyToMessageId)
//                                 ?.content || "Message"}
//                             </div>
//                           </div>
//                         )}

//                         {msg.content && (
//                           <>
//                             <p className="break-words whitespace-pre-wrap leading-relaxed">
//                               {msg.content}
//                             </p>
//                             <LinkPreviewComponent
//                               url={extractFirstUrl(msg.content)}
//                             />
//                           </>
//                         )}

//                         {msg.image && (
//                           <img
//                             src={msg.image}
//                             alt="chat"
//                             className="rounded-xl mt-2 max-w-full"
//                           />
//                         )}
//                       </div>

//                       {/* Reply button */}
//                       <button
//                         className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white/90 hover:bg-white shadow-sm"
//                         onClick={() => setReplyTo(msg.id)}
//                       >
//                         <CornerUpLeft className="w-3 h-3 text-gray-600" />
//                       </button>
//                     </div>

//                     {/* Avatar for current user */}
//                     {isCurrentUser && (
//                       <div className="flex-shrink-0 ml-3">
//                         {showAvatar ? (
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center ${getUserColor(
//                               senderEmail
//                             )}`}
//                           >
//                             <span className="text-white font-medium text-xs">
//                               {getInitials(senderEmail)}
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="w-8 h-8" />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="bg-white border-t border-gray-200 p-4 space-y-3">
//             {replyTo && (
//               <div className="bg-gray-50 text-gray-700 text-sm px-3 py-2 rounded-xl flex justify-between items-center">
//                 <span className="truncate">
//                   Replying to:{" "}
//                   {chat.find((msg) => msg.id === replyTo)?.content ||
//                     "Previous message"}
//                 </span>
//                 <button
//                   onClick={() => setReplyTo(null)}
//                   className="text-gray-400 hover:text-gray-600 ml-2"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             )}

//             <div className="flex items-center gap-3">
//               {image && (
//                 <div className="bg-gray-50 px-3 py-2 rounded-xl flex items-center gap-2">
//                   <span className="text-sm text-gray-600 truncate max-w-32">
//                     {image.name}
//                   </span>
//                   <button
//                     onClick={() => setImage(null)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}

//               <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Write your message..."
//                 className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
//               />

//               <button
//                 onClick={() => setShowFileUpload(true)}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <Paperclip className="w-5 h-5" />
//               </button>

//               <button
//                 onClick={ sendPrivateMessage}
//                 disabled={uploading || (!message.trim() && !image)}
//                 className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-full disabled:opacity-50 hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
//               >
//                 {uploading ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Send className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </>
//       ) : (
//         renderParticipantsTab()
//       )}

//       {/* Add Member Modal */}
//       {showAddMember && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
//             <h3 className="font-semibold text-gray-900 mb-4">Add Member</h3>
//             <input
//               type="email"
//               value={newMemberEmail}
//               onChange={(e) => setNewMemberEmail(e.target.value)}
//               placeholder="Enter email address"
//               className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={addMember}
//                 className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
//               >
//                 Add Member
//               </button>
//               <button
//                 onClick={() => setShowAddMember(false)}
//                 className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* File Upload Modal */}
//       {showFileUpload && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
//             <div className="text-center space-y-4">
//               <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
//                 <Upload className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="font-semibold text-gray-900">Upload Image</h3>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   setImage(e.target.files[0]);
//                   setShowFileUpload(false);
//                 }}
//                 className="hidden"
//               />
//               <div className="space-y-2">
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-medium hover:from-teal-600 hover:to-cyan-600 transition-all"
//                 >
//                   Choose File
//                 </button>
//                 <button
//                   onClick={() => setShowFileUpload(false)}
//                   className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatComponent;







import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LinkPreviewComponent from "./auth/link-preview";
import { Send, Paperclip, Upload, X, Users, CornerUpLeft } from "lucide-react";

const socket = io("http://localhost:3002");

const ChatComponent = ({
  senderId,
  receiverId,
  senderEmail,
  receiverEmail,
}) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [activeTab, setActiveTab] = useState("Messages");

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageRefs = useRef({});

  const getInitials = (email) =>
    email ? email.split("@")[0].charAt(0).toUpperCase() : "U";

  const getUserColor = (email) => {
    const colors = [
      "bg-orange-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const hash = email?.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const extractFirstUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text?.match(urlRegex);
    return urls?.[0] ?? null;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp || Date.now());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp || Date.now());
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        ", " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  useEffect(() => {
    if (!senderId || !receiverId) return;

    socket.emit("loadPrivateHistory", { senderId, receiverId });

    socket.on("messageHistory", (messages) => {
      setChat(messages);
    });

    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("messageHistory");
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

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

  const  sendPrivateMessage = async () => {
    if (!message.trim() && !image) return;

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) return;
    }

    socket.emit(" sendPrivateMessage", {
      senderId,
      receiverId,
      senderEmail,
      receiverEmail,
      content: message,
      image: imageUrl,
      replyToMessageId: replyTo,
    });

    setMessage("");
    setImage(null);
    setReplyTo(null);
    setShowFileUpload(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
       sendPrivateMessage();
    }
  };

  const scrollToMessage = (id) => {
    messageRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    messageRefs.current[id]?.classList.add("ring-2", "ring-teal-400");
    setTimeout(() => {
      messageRefs.current[id]?.classList.remove("ring-2", "ring-teal-400");
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <Users className="text-white w-4 h-4" />
          </div>
          <h1 className="text-lg font-medium text-gray-900">Group Chat</h1>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("Messages")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "Messages"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("Participants")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "Participants"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Participants
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </div>
        )}

        {chat.map((msg, index) => {
          const isCurrentUser = msg.senderEmail === senderEmail;
          const showAvatar =
            index === 0 || chat[index - 1].senderEmail !== msg.senderEmail;
          const showName = showAvatar; // Show name for all new message groups

          return (
            <div key={msg.id || index} className="space-y-2">
              {/* Sender name and timestamp */}
              {showName && (
                <div
                  className={`flex items-center gap-2 ${
                    isCurrentUser ? "justify-end mr-12" : "ml-12"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {isCurrentUser
                      ? "You"
                      : msg.senderEmail?.split("@")[0] || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
              )}

              <div
                ref={(el) => (messageRefs.current[msg.id] = el)}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } group`}
              >
                {/* Avatar for other users */}
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-3">
                    {showAvatar ? (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getUserColor(
                          senderEmail
                        )}`}
                      >
                        <span className="text-white font-medium text-xs">
                          {getInitials(senderEmail)}
                        </span>
                      </div>
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div className="relative max-w-md">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm transition-all ${
                      isCurrentUser
                        ? "bg-teal-500 text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100"
                    }`}
                  >
                    {/* Reply Preview */}
                    {msg.replyToMessageId && (
                      <div
                        onClick={() => scrollToMessage(msg.replyToMessageId)}
                        className={`text-xs mb-2 p-2 rounded-lg border-l-2 cursor-pointer ${
                          isCurrentUser
                            ? "bg-teal-600 border-teal-300 text-teal-100"
                            : "bg-gray-50 border-gray-300 text-gray-500"
                        }`}
                      >
                        <span className="opacity-70">Replying to:</span>
                        <div className="truncate font-medium">
                          {chat.find((m) => m.id === msg.replyToMessageId)
                            ?.content || "Message"}
                        </div>
                      </div>
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

                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="chat"
                        className="rounded-xl mt-2 max-w-full"
                      />
                    )}
                  </div>

                  {/* Reply button */}
                  <button
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => setReplyTo(msg.id)}
                  >
                    <CornerUpLeft className="w-3 h-3 text-gray-600" />
                  </button>
                </div>

                {/* Avatar for current user */}
                {isCurrentUser && (
                  <div className="flex-shrink-0 ml-3">
                    {showAvatar ? (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getUserColor(
                          senderEmail
                        )}`}
                      >
                        <span className="text-white font-medium text-xs">
                          {getInitials(senderEmail)}
                        </span>
                      </div>
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <div className="text-center space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-medium text-gray-900">Upload Image</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setShowFileUpload(false);
                }}
                className="hidden"
              />
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
                >
                  Choose File
                </button>
                <button
                  onClick={() => setShowFileUpload(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        {replyTo && (
          <div className="bg-gray-50 text-gray-700 text-sm px-3 py-2 rounded-xl flex justify-between items-center">
            <span className="truncate">
              Replying to:{" "}
              {chat.find((msg) => msg.id === replyTo)?.content ||
                "Previous message"}
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {image && (
            <div className="bg-gray-50 px-3 py-2 rounded-xl flex items-center gap-2">
              <span className="text-sm text-gray-600 truncate max-w-32">
                {image.name}
              </span>
              <button
                onClick={() => setImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write your message..."
            className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />

          <button
            onClick={() => setShowFileUpload(true)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            onClick={ sendPrivateMessage}
            disabled={uploading || (!message.trim() && !image)}
            className="bg-teal-500 text-white p-3 rounded-full disabled:opacity-50 hover:bg-teal-600 transition-colors shadow-lg"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;