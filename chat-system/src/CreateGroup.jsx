import React, { useState, useEffect } from "react";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    
    // const [participantsUser, setParticipantsUser] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3002/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((u) => u.id !== currentUser?.id);
        setAllUsers(filtered);
      });

      //   setParticipantsUser({ participants.push(currentUser.id) });
      
    //   console.log("Current User:", participants.push(currentUser.id));
      console.log("User", currentUser.email)

      const users = participants.map((user) => {
        user.email
      })
      
      console.log("Participants User:", users);
  }, []);
    
// console.log("Current User:", participantsUser);
    

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
    //   console.log("Current User:", participantsUser);
      
  const users = participants.map((user) => {
    user.email;
  });
  console.log("Participants User:", users);
    if (response.ok) {
      window.location.href = "/chat"; // redirect back to chat
    }
  };

    const toggleParticipant = (id) => {
      
    setParticipants((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id ]
    );
  };

  return (
    <div className="p-6 h-50 w-50 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Group</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full p-2 border rounded mb-4"
      />
      <div className="mb-4">
        <p className="font-medium mb-2">Add Participants:</p>
        {allUsers.map((user) => (
          <div key={user.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={participants.includes(user.id)}
              onChange={() => toggleParticipant(user.id)}
              className="mr-2"
            />
            {user.email}
          </div>
        ))}
      </div>
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Create
      </button>
    </div>
  );
}

export default CreateGroup;
