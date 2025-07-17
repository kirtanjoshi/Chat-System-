// // // /* eslint-disable react-hooks/rules-of-hooks */
// // //   import React, { useEffect, useState } from "react";
// // //   import { useNavigate } from "react-router-dom";
// // //   import { io } from "socket.io-client";

// // //   const user = JSON.parse(localStorage.getItem("user"));
// // //   const CURRENT_USER_ID = user?.id;
// // //   const CURRENT_USER_EMAIL = user?.email;

// // //   const socket = io("http://localhost:3002");

// // //   function CreateGroup({ onGroupCreated }) {
// // //     const [groupName, setGroupName] = useState("");
// // //     const [users, setUsers] = useState([]);
// // //     const [selectedUsers, setSelectedUsers] = useState([]);

// // //     useEffect(() => {
// // //       fetch("http://localhost:3002/auth/users")
// // //         .then((res) => res.json())
// // //         .then((data) => setUsers(data))
// // //         .catch(console.error);
// // //     }, []);

// // //     const toggleUser = (id) => {
// // //       setSelectedUsers((prev) =>
// // //         prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
// // //       );
// // //     };

// // //     const handleCreateGroup = async () => {
// // //       if (!groupName.trim() || selectedUsers.length === 0) {
// // //         alert("Group name and participants are required.");
// // //         return;
// // //       }

// // //       try {
// // //         await fetch("http://localhost:3002/chat/create", {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //           },
// // //           body: JSON.stringify({
// // //             name: groupName,
// // //             creatorId: CURRENT_USER_ID,
// // //             participantIds: selectedUsers,
// // //           }),
// // //         });
// // //         setGroupName("");
// // //         setSelectedUsers([]);
// // //         onGroupCreated();
// // //       } catch (err) {
// // //         console.error("Error creating group:", err);
// // //       }
// // //     };

// // //     return (
// // //       <div style={{ marginBottom: 20 }}>
// // //         <h2>Create New Group</h2>
// // //         <input
// // //           type="text"
// // //           placeholder="Group Name"
// // //           value={groupName}
// // //           onChange={(e) => setGroupName(e.target.value)}
// // //         />
// // //         <div
// // //           style={{
// // //             maxHeight: 150,
// // //             overflowY: "auto",
// // //             border: "1px solid #ccc",
// // //             marginTop: 5,
// // //           }}
// // //         >
// // //           {users.map((user) => (
// // //             <label key={user.id} style={{ display: "block", padding: 5 }}>
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selectedUsers.includes(user.id)}
// // //                 onChange={() => toggleUser(user.id)}
// // //               />{" "}
// // //               {user.email}
// // //             </label>
// // //           ))}
// // //         </div>
// // //         <button onClick={handleCreateGroup} style={{ marginTop: 10 }}>
// // //           Create Group
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   function GroupComponents() {
// // //     const [groups, setGroups] = useState([]);
// // //     const [selectedGroup, setSelectedGroup] = useState(null);
// // //     const [messages, setMessages] = useState([]);
// // //     const [input, setInput] = useState("");
// // //     const navigate = useNavigate();
// // //     const fetchGroups = async () => {
// // //       try {
// // //         const res = await fetch(`http://localhost:3002/chat/user/${CURRENT_USER_ID}/groups`);
// // //         const data = await res.json();
// // //         setGroups(data);
// // //       } catch (err) {
// // //         console.error("Error fetching groups:", err);
// // //       }
// // //     };

// // //     useEffect(() => {
    
// // //       const user = localStorage.getItem("user");
// // //       if (!user) {
// // //         navigate("/login");
// // //       }
// // //     }, []);

// // //     useEffect(() => {
// // //       fetchGroups();
// // //     }, []);

// // //     useEffect(() => {
// // //       if (!selectedGroup) return;

// // //       socket.connect();
// // //       socket.emit("joinRoom", selectedGroup.id);
// // //       socket.emit("loadHistory", selectedGroup.id);

// // //       socket.on("messageHistory", (msgs) => setMessages(msgs));
// // //       socket.on("groupMessage", (msg) => setMessages((prev) => [...prev, msg]));

// // //       return () => {
// // //         socket.off("messageHistory");
// // //         socket.off("groupMessage");
// // //         socket.disconnect();
// // //         setMessages([]);
// // //       };
// // //     }, [selectedGroup]);

// // //     const sendMessage = () => {
// // //       if (!input.trim()) return;

// // //       socket.emit("sendGroupMessage", {
// // //         senderId: CURRENT_USER_ID,
// // //         senderEmail: CURRENT_USER_EMAIL,
// // //         roomId: selectedGroup.id,
// // //         content: input.trim(),
// // //       });


     

// // //       setInput("");
// // //     };

// // //     const handleLeaveGroup = async (groupId) => {
// // //       try {
// // //         await fetch(`http://localhost:3002/chat/${groupId}/leave/${CURRENT_USER_ID}`, {
// // //           method: "POST",
// // //         });
// // //         setSelectedGroup(null);
// // //         fetchGroups();
// // //       } catch (err) {
// // //         console.error("Error leaving group:", err);
// // //       }
// // //     };

// // //     return (
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           height: "90vh",
// // //           maxWidth: 900,
// // //           margin: "auto",
// // //           padding: 20,
// // //         }}
// // //       >
// // //         <div style={{ flex: 1, marginRight: 20 }}>
// // //           <CreateGroup onGroupCreated={fetchGroups} />
// // //           <h3>Groups</h3>
// // //           <h1>gmail :{CURRENT_USER_EMAIL}</h1>
// // //           <ul style={{ listStyle: "none", padding: 0 }}>
// // //             {groups?.map((group) => (
// // //               <li
// // //                 key={group.id}
// // //                 onClick={() => setSelectedGroup(group)}
// // //                 style={{
// // //                   cursor: "pointer",
// // //                   padding: 10,
// // //                   backgroundColor:
// // //                     selectedGroup?.id === group.id ? "#d0e6ff" : "transparent",
// // //                   borderBottom: "1px solid #ccc",
// // //                   position: "relative",
// // //                 }}
// // //               >
// // //                 {group.name} {group.isGroup ? "(Group)" : "(1-1)"}
// // //                 <button
// // //                   style={{ position: "absolute", right: 10, top: 10, fontSize: 12 }}
// // //                   onClick={e => {
// // //                     e.stopPropagation();
// // //                     handleLeaveGroup(group.id);
// // //                   }}
// // //                 >
// // //                   Leave
// // //                 </button>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>

// // //         <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
// // //           <h3>
// // //             Chat: {selectedGroup ? selectedGroup.name : "No group selected"}
// // //           </h3>
// // //           <div
// // //             style={{
// // //               flex: 1,
// // //               border: "1px solid #ccc",
// // //               padding: 10,
// // //               marginBottom: 10,
// // //               overflowY: "auto",
// // //             }}
// // //           >
// // //             {messages.map((msg) => (
// // //               <div key={msg.id} style={{ marginBottom: 10 }}>
// // //                 <b>
// // //                   {msg.senderId === CURRENT_USER_ID
// // //                     ? "You"
// // //                     : msg.senderEmail }
                 
// // //                 </b>
// // //                 : {msg.content}
// // //                 <br />
// // //                 <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div>
// // //             <input
// // //               style={{ width: "80%", padding: 8 }}
// // //               placeholder="Type your message"
// // //               value={input}
// // //               onChange={(e) => setInput(e.target.value)}
// // //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // //             />
// // //             <button
// // //               style={{ width: "18%", marginLeft: "2%", padding: 8 }}
// // //               onClick={sendMessage}
// // //             >
// // //               Send
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   export default GroupComponents;





// // /* eslint-disable react-hooks/rules-of-hooks */
// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { io } from "socket.io-client";
// // import { Search, Plus, Send, Phone, MoreHorizontal, Users, LogOut, User } from "lucide-react";

// // // Your original backend connection code
// // const user = JSON.parse(localStorage.getItem("user"));
// // const CURRENT_USER_ID = user?.id;
// // const CURRENT_USER_EMAIL = user?.email;

// // const socket = io("http://localhost:3002");

// // function CreateGroup({ onGroupCreated }) {
// //   const [groupName, setGroupName] = useState("");
// //   const [users, setUsers] = useState([]);
// //   const [selectedUsers, setSelectedUsers] = useState([]);
// //   const [isOpen, setIsOpen] = useState(false);

// //   useEffect(() => {
// //     fetch("http://localhost:3002/auth/users")
// //       .then((res) => res.json())
// //       .then((data) => setUsers(data))
// //       .catch(console.error);
// //   }, []);

// //   const toggleUser = (id) => {
// //     setSelectedUsers((prev) =>
// //       prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
// //     );
// //   };

// //   const handleCreateGroup = async () => {
// //     if (!groupName.trim() || selectedUsers.length === 0) {
// //       alert("Group name and participants are required.");
// //       return;
// //     }

// //     try {
// //       await fetch("http://localhost:3002/chat/create", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           name: groupName,
// //           creatorId: CURRENT_USER_ID,
// //           participantIds: selectedUsers,
// //         }),
// //       });
// //       setGroupName("");
// //       setSelectedUsers([]);
// //       setIsOpen(false);
// //       onGroupCreated();
// //     } catch (err) {
// //       console.error("Error creating group:", err);
// //     }
// //   };

// //   const getInitials = (email) => {
// //     return email.split('@')[0].charAt(0).toUpperCase();
// //   };

// //   const getAvatarColor = (id) => {
// //     const colors = [
// //       'from-blue-400 to-blue-600',
// //       'from-green-400 to-green-600',
// //       'from-purple-400 to-purple-600',
// //       'from-pink-400 to-pink-600',
// //       'from-yellow-400 to-yellow-600',
// //       'from-indigo-400 to-indigo-600'
// //     ];
// //     return colors[id % colors.length];
// //   };

// //   return (
// //     <div className="mb-6">
// //       <button
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
// //       >
// //         <Plus size={20} />
// //       </button>
      
// //       {isOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-96">
// //             <h3 className="text-lg font-semibold mb-4 text-gray-800">Create New Group</h3>
// //             <input
// //               type="text"
// //               placeholder="Group Name"
// //               value={groupName}
// //               onChange={(e) => setGroupName(e.target.value)}
// //               className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
// //             />
// //             <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-4">
// //               {users.map((user) => (
// //                 <label key={user.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedUsers.includes(user.id)}
// //                     onChange={() => toggleUser(user.id)}
// //                     className="mr-3 text-orange-500 focus:ring-orange-500"
// //                   />
// //                   <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white text-sm font-medium mr-3`}>
// //                     {getInitials(user.email)}
// //                   </div>
// //                   <span className="text-gray-700">{user.email}</span>
// //                 </label>
// //               ))}
// //             </div>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={handleCreateGroup}
// //                 className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
// //               >
// //                 Create Group
// //               </button>
// //               <button
// //                 onClick={() => setIsOpen(false)}
// //                 className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function GroupComponents() {
// //   const [groups, setGroups] = useState([]);
// //   const [selectedGroup, setSelectedGroup] = useState(null);
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState("");
// //   const navigate = useNavigate();

// //   const fetchGroups = async () => {
// //     try {
// //       const res = await fetch(`http://localhost:3002/chat/user/${CURRENT_USER_ID}/groups`);
// //       const data = await res.json();
// //       setGroups(data);
// //     } catch (err) {
// //       console.error("Error fetching groups:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     const user = localStorage.getItem("user");
// //     if (!user) {
// //       navigate("/login");
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchGroups();
// //   }, []);

// //   useEffect(() => {
// //     if (!selectedGroup) return;

// //     socket.connect();
// //     socket.emit("joinRoom", selectedGroup.id);
// //     socket.emit("loadHistory", selectedGroup.id);

// //     socket.on("messageHistory", (msgs) => setMessages(msgs));
// //     socket.on("groupMessage", (msg) => setMessages((prev) => [...prev, msg]));

// //     return () => {
// //       socket.off("messageHistory");
// //       socket.off("groupMessage");
// //       socket.disconnect();
// //       setMessages([]);
// //     };
// //   }, [selectedGroup]);

// //   const sendMessage = () => {
// //     if (!input.trim()) return;

// //     socket.emit("sendGroupMessage", {
// //       senderId: CURRENT_USER_ID,
// //       senderEmail: CURRENT_USER_EMAIL,
// //       roomId: selectedGroup.id,
// //       content: input.trim(),
// //     });

// //     setInput("");
// //   };

// //   const handleLeaveGroup = async (groupId) => {
// //     try {
// //       await fetch(`http://localhost:3002/chat/${groupId}/leave/${CURRENT_USER_ID}`, {
// //         method: "POST",
// //       });
// //       setSelectedGroup(null);
// //       fetchGroups();
// //     } catch (err) {
// //       console.error("Error leaving group:", err);
// //     }
// //   };

// //   const getInitials = (name) => {
// //     if (!name) return "?";
// //     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
// //   };

// //   const getAvatarColor = (id) => {
// //     const colors = [
// //       'from-blue-400 to-blue-600',
// //       'from-green-400 to-green-600',
// //       'from-purple-400 to-purple-600',
// //       'from-pink-400 to-pink-600',
// //       'from-yellow-400 to-yellow-600',
// //       'from-indigo-400 to-indigo-600'
// //     ];
// //     return colors[id % colors.length];
// //   };

// //   const formatTime = (dateString) => {
// //     return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
// //         {/* Header */}
// //         <div className="p-4 border-b border-gray-200">
// //           <div className="flex items-center justify-between mb-4">
// //             <h1 className="text-xl font-semibold text-gray-800">Chat</h1>
// //             <CreateGroup onGroupCreated={fetchGroups} />
// //           </div>
// //           <div className="relative">
// //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search"
// //               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //             />
// //           </div>
// //         </div>

// //         {/* Current User */}
// //         <div className="p-4 border-b border-gray-200">
// //           <div className="flex items-center space-x-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
// //               {CURRENT_USER_EMAIL ? getInitials(CURRENT_USER_EMAIL) : "?"}
// //             </div>
// //             <div className="flex-1">
// //               <p className="text-sm font-medium text-gray-800">You</p>
// //               <p className="text-xs text-gray-500">{CURRENT_USER_EMAIL}</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Groups List */}
// //         <div className="flex-1 overflow-y-auto">
// //           <div className="p-2">
// //             <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">GROUPS</h3>
// //             {groups?.map((group) => (
// //               <div
// //                 key={group.id}
// //                 onClick={() => setSelectedGroup(group)}
// //                 className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 group relative ${
// //                   selectedGroup?.id === group.id
// //                     ? 'bg-orange-50 border-l-4 border-orange-500'
// //                     : 'hover:bg-gray-50'
// //                 }`}
// //               >
// //                 <div className="flex items-center space-x-3">
// //                   <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(group.id)} rounded-full flex items-center justify-center text-white font-medium`}>
// //                     {getInitials(group.name)}
// //                   </div>
// //                   <div className="flex-1 min-w-0">
// //                     <div className="flex items-center justify-between">
// //                       <h4 className="font-medium text-gray-800 truncate">
// //                         {group.name} {group.isGroup ? "(Group)" : "(1-1)"}
// //                       </h4>
// //                     </div>
// //                     <p className="text-sm text-gray-600 truncate">
// //                       {group.lastMessage || "No messages yet"}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleLeaveGroup(group.id);
// //                   }}
// //                   className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
// //                   title="Leave Group"
// //                 >
// //                   <LogOut size={14} className="text-gray-500" />
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 flex flex-col">
// //         {selectedGroup ? (
// //           <>
// //             {/* Chat Header */}
// //             <div className="p-4 border-b border-gray-200 bg-white">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-3">
// //                   <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(selectedGroup.id)} rounded-full flex items-center justify-center text-white font-medium`}>
// //                     {getInitials(selectedGroup.name)}
// //                   </div>
// //                   <div>
// //                     <h3 className="font-semibold text-gray-800">{selectedGroup.name}</h3>
// //                     <p className="text-sm text-gray-500">
// //                       {selectedGroup.isGroup ? "Group Chat" : "Direct Message"}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center space-x-2">
// //                   <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
// //                     <Phone size={20} className="text-gray-600" />
// //                   </button>
// //                   <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
// //                     <MoreHorizontal size={20} className="text-gray-600" />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Messages */}
// //             <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //               {messages.map((msg) => (
// //                 <div
// //                   key={msg.id}
// //                   className={`flex ${msg.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'}`}
// //                 >
// //                   <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
// //                     msg.senderId === CURRENT_USER_ID
// //                       ? 'bg-orange-500 text-white'
// //                       : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
// //                   }`}>
// //                     {msg.senderId !== CURRENT_USER_ID && (
// //                       <p className="text-xs text-gray-500 mb-1 font-medium">
// //                         {msg.senderEmail || "Unknown User"}
// //                       </p>
// //                     )}
// //                     <p className="text-sm leading-relaxed">{msg.content}</p>
// //                     <p className={`text-xs mt-1 ${
// //                       msg.senderId === CURRENT_USER_ID ? 'text-orange-100' : 'text-gray-500'
// //                     }`}>
// //                       {formatTime(msg.createdAt)}
// //                     </p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Message Input */}
// //             <div className="p-4 border-t border-gray-200 bg-white">
// //               <div className="flex items-center space-x-3">
// //                 <input
// //                   type="text"
// //                   placeholder="Type your message..."
// //                   value={input}
// //                   onChange={(e) => setInput(e.target.value)}
// //                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //                   className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
// //                 />
// //                 <button
// //                   onClick={sendMessage}
// //                   className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
// //                 >
// //                   <Send size={20} />
// //                 </button>
// //               </div>
// //             </div>
// //           </>
// //         ) : (
// //           <div className="flex-1 flex items-center justify-center bg-gray-50">
// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
// //                 <Users size={40} className="text-gray-400" />
// //               </div>
// //               <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
// //               <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default GroupComponents;




/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Search, Send } from "lucide-react";

const user = JSON.parse(localStorage.getItem("user"));
const CURRENT_USER_ID = user?.id;
const CURRENT_USER_EMAIL = user?.email;

const socket = io("http://localhost:3002");

function ChatApp() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const fetchGroups = async () => {
    const res = await fetch(`http://localhost:3002/chat/user/${CURRENT_USER_ID}/groups`);
    const data = await res.json();
    // console.log("Fetched groups:", data);
    setGroups(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3002/auth/users");
    const data = await res.json();
    const filtered = data.filter((u) => u.id !== CURRENT_USER_ID);
    setUsers(filtered);
  };

  useEffect(() => {
    if (!CURRENT_USER_ID) navigate("/login");
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
      socket.emit("joinPrivateRoom", CURRENT_USER_ID); // ensures current user receives private messages
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

  const sendMessage = () => {
    if (!input.trim()) return;

    const payload = {
      senderId: CURRENT_USER_ID,
      senderEmail: CURRENT_USER_EMAIL,
      content: input.trim(),
    };

    if (selectedChat.isGroup) {
      socket.emit("sendGroupMessage", { ...payload, roomId: selectedChat.id });
    } else {
      socket.emit("sendPrivateMessage", {
        ...payload,
        receiverId: selectedChat.id,
        receiverEmail: selectedChat.email,
      });
    }

    setInput("");
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <button
        className="bg-orange-500 text-white  py-2 mt-2 rounded"
        onClick={() => navigate("/create")}
      >
        + Create Group

      
      </button>

      <div>{ CURRENT_USER_EMAIL}</div>

      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Chat App</h1>
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
        <div className="p-2 overflow-y-auto flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">GROUPS</h3>
          {groups.map((group) => (
            <div
              key={`group-${group.id}`}
              onClick={() => setSelectedChat({ ...group, isGroup: true })}
              className="p-3 hover:bg-orange-50 rounded cursor-pointer"
            >
              {group.name}
            </div>
          ))}

          <h3 className="text-sm font-medium text-gray-500 mt-4 mb-1">
            DIRECT MESSAGES
          </h3>
          {users.map((u) => (
            <div
              key={`user-${u.id}`}
              onClick={() => setSelectedChat({ ...u, isGroup: false })}
              className="p-3 hover:bg-orange-50 rounded cursor-pointer"
            >
              {u.email}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-lg font-semibold">
                {selectedChat.isGroup ? selectedChat.name : selectedChat.email}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === CURRENT_USER_ID
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-xl text-sm ${
                      msg.senderId === CURRENT_USER_ID
                        ? "bg-orange-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {msg.senderId !== CURRENT_USER_ID && (
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        {msg.senderEmail}
                      </p>
                    )}

                    {msg.content}
                    <div className="text-xs mt-1 text-right">
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message"
                  className="flex-1 p-3 border rounded-full"
                />
                <button
                  onClick={sendMessage}
                  className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;



