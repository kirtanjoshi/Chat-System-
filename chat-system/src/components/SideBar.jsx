



import React from "react";
import { Search, Plus, MoreVertical, Users } from "lucide-react";

const Sidebar = ({
  user,
  users,
  groups,
  selectedChat,
  setSelectedChat,
  showCreateGroup,
  setShowCreateGroup,
  isOpen,
  setIsOpen,
  onlineUsers,
  logout,
}) => {
  const getInitials = (email) =>
    email?.split("@")[0].substring(0, 2).toUpperCase();


  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-semibold">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user?.email)
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold">Chats</h1>
              <p className="text-sm text-green-100">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
            >
              <Plus size={20} />
            </button>
            <div className="relative">
              <button
                className="p-2 hover:bg-green-700 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <MoreVertical size={20} />
              </button>
              {isOpen && (
                <>
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div
                      className="p-4 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-lg transition-colors"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </div>
                  </div>
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                  />
                </>
              )}
            </div>
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

      {/* Group List */}
      <div className="flex-1 overflow-y-auto">
        {groups?.length > 0 && (
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
                    {/* {getLastMessage(group)} */}
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
                {getInitials(u?.email)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {u.email.split("@")[0]}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {/* {getLastMessage(u)} */}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-400 mb-1">12:30</div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: onlineUsers.has(u.id) ? "green" : "gray",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
