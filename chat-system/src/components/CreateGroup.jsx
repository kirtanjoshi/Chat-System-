import React, { useState, useEffect } from "react";

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
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile Picture"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      getInitials(user.email)
                    )}
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
export default CreateGroup;