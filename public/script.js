const socket = io();
let userId = "";
let username = "";
let currentRecipient = null;
let privateMessagePage = 1;
const privateMessageLimit = 10;
let currentGroupId = null;
let groupMessagePage = 1;
const groupMessageLimit = 10;

// Function to switch between registration, login, chat, and private chat views
function showView(viewId) {
  hideAllViews();
  const viewElement = document.getElementById(viewId);
  if (viewElement) {
    viewElement.style.display = "block";
  } else {
    console.error(`Element with ID ${viewId} not found.`);
  }
}

// Helper function to hide all views
function hideAllViews() {
  document.getElementById("registerContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("chatContainer").style.display = "none";
  document.getElementById("privateChatContainer").style.display = "none";
  document.getElementById("groupChatContainer").style.display = "none";
}

// Example check for form submission
document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const regUserId = document.getElementById("regUserId").value;
  const regUsername = document.getElementById("regUsername").value;
  const regPassword = document.getElementById("regPassword").value;

  if (
    regUserId.trim() === "" ||
    regUsername.trim() === "" ||
    regPassword.trim() === ""
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Proceed with form submission
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userid: regUserId,
      username: regUsername,
      password: regPassword,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      alert("Error registering user");
    });
});

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const loginUsername = document.getElementById("loginUsername").value;
  const loginPassword = document.getElementById("loginPassword").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: loginUsername,
      password: loginPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      userId = data.userid;
      username = data.username;
      document.getElementById("currentUser").textContent = username;
      showView("chatContainer");
      socket.emit("joinRoom", { userId, username });
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert("Invalid username or password");
    });
});

// Event listener for sending private messages
document
  .getElementById("privateMessageForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("privateMessageInput").value;
    if (messageInput.trim() === "") {
      return;
    }
    sendPrivateMessage(currentRecipient, messageInput);
    document.getElementById("privateMessageInput").value = "";
  });

// Event listener for back to chat button in private chat view
document.getElementById("backToChatBtn").addEventListener("click", () => {
  showView("chatContainer");
  currentRecipient = null;
  document.getElementById("privateMessages").innerHTML = "";
  privateMessagePage = 1; // Reset pagination to first page
});

// Function to send a private message to another user
function sendPrivateMessage(to, message) {
  const messageData = {
    user: username,
    message,
    timestamp: new Date().toISOString(),
  };
  socket.emit("private-message", { to, messageData });
  displayPrivateMessage(messageData, true);
}

// Function to display a private message
function displayPrivateMessage(messageData, isSender) {
  const privateMessages = document.getElementById("privateMessages");
  const messageElement = createMessageElement(messageData, isSender);
  privateMessages.appendChild(messageElement);
  privateMessages.scrollTop = privateMessages.scrollHeight;
}

function fetchPrivateMessages(recipient, isInitialLoad = false) {
  fetch(
    `/messages?sender=${username}&recipient=${recipient}&page=${privateMessagePage}&limit=${privateMessageLimit}`
  )
    .then((response) => response.json())
    .then((messages) => {
      const privateMessages = document.getElementById("privateMessages");
      const scrollPosition =
        privateMessages.scrollHeight - privateMessages.scrollTop;

      messages.messages.forEach((message) => {
        const messageData = {
          user: message.sender,
          message: message.message,
          timestamp: new Date(message.created_at),
        };

        // If it's the initial load, append messages at the bottom
        if (isInitialLoad) {
          displayPrivateMessage(messageData, message.sender === username);
        } else {
          // Otherwise, prepend messages at the top
          const messageElement = createMessageElement(
            messageData,
            message.sender === username
          );
          privateMessages.insertBefore(
            messageElement,
            privateMessages.firstChild
          );
        }
      });

      if (!isInitialLoad) {
        privateMessages.scrollTop =
          privateMessages.scrollHeight - scrollPosition;
      }
    })
    .catch((error) => {
      console.error("Error fetching private messages:", error);
    });
}

// Function to create a message element
function createMessageElement(messageData, isSender) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isSender ? "sent" : "received"}`;

  // Adjust the timestamp by 4 hours
  const timestamp = new Date(messageData.timestamp);
  timestamp.setHours(timestamp.getHours() + 4);

  const formattedTimestamp = timestamp.toLocaleTimeString();

  messageElement.innerHTML = `
    <div class="message-user">${messageData.user}</div>
    <div class="message-content">${messageData.message}</div>
    <div class="message-timestamp">${formattedTimestamp}</div>
  `;
  return messageElement;
}

// Socket event to receive private message
socket.on("private-message", (messageData) => {
  if (currentRecipient === messageData.user || username === messageData.user) {
    displayPrivateMessage(messageData, false);
  }
});

// Socket event to update online users list
socket.on("update-users", (users) => {
  const onlineUsersList = document.getElementById("onlineUsersList");
  onlineUsersList.innerHTML = "";
  users.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.textContent = `${user.username} (${user.status})`;
    userElement.addEventListener("click", () => {
      if (user.userid !== userId) {
        currentRecipient = user.username;
        document.getElementById(
          "privateChatWith"
        ).textContent = `Chat with ${user.username}`;
        fetchPrivateMessages(user.username);
        showView("privateChatContainer");
      }
    });
    onlineUsersList.appendChild(userElement);
  });
});

// Scroll event listener for loading more messages
document
  .getElementById("privateMessages")
  .addEventListener("scroll", (event) => {
    const privateMessages = document.getElementById("privateMessages");
    if (privateMessages.scrollTop === 0) {
      // Load more messages when scrolled to the top
      privateMessagePage++;
      fetchPrivateMessages(currentRecipient);
    }
  });
//------------------------------------------------------------------group chat ----------------------------------------------------------------------------//
// let currentGroupId = null;
// let groupMessagePage = 1;
// const groupMessageLimit = 10;

// Create group button event listener
document.getElementById("createGroupBtn").addEventListener("click", () => {
  const groupName = prompt("Enter group name:");
  if (groupName) {
    fetch("/create-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupname: groupName }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        displayGroupNames(); // Refresh group list
      })
      .catch((error) => {
        console.error("Error creating group:", error);
        alert("Error creating group");
      });
  }
});

// Function to display group names
function displayGroupNames() {
  fetch("/group-names")
    .then((response) => response.json())
    .then((groupNames) => {
      const groupList = document.getElementById("groupList");
      groupList.innerHTML = "";
      groupNames.forEach((group) => {
        const groupItem = document.createElement("li");
        groupItem.textContent = `Group: ${group.groupname}`;
        groupItem.dataset.groupid = group.groupid;
        groupList.appendChild(groupItem);

        groupItem.addEventListener("click", () => {
          currentGroupId = group.groupid;
          showView("groupChatContainer");
          fetchGroupMessages(currentGroupId, true);
          fetchGroupMembers(currentGroupId);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching group names:", error);
    });
}
displayGroupNames();

// Function to fetch group members
function fetchGroupMembers(groupId) {
  fetch(`/group-members?groupid=${groupId}`)
    .then((response) => response.json())
    .then((members) => {
      updateGroupMembersUI(members);
    })
    .catch((error) => {
      console.error("Error fetching group members:", error);
    });
}

// Update UI with group members
function updateGroupMembersUI(members) {
  const groupChatWith = document.getElementById("groupChatWith");
  groupChatWith.textContent = `Group Chat with: ${members
    .map((member) => member.username)
    .join(", ")}`;
}

// Event listener to add user to group
document.getElementById("addUserToGroupBtn").addEventListener("click", () => {
  fetch("/users")
    .then((response) => response.json())
    .then((allUsers) => {
      // Create a user list container
      const userListContainer = document.createElement("div");
      userListContainer.id = "userListContainer";
      userListContainer.classList.add("user-list-container");

      // Clear existing user list container if it exists
      const existingContainer = document.getElementById("userListContainer");
      if (existingContainer) {
        existingContainer.remove();
      }

      // Append user list container to the body
      document.body.appendChild(userListContainer);

      // Append users to the user list container
      allUsers.forEach((user) => {
        const userItem = document.createElement("div");
        userItem.textContent = `User ID: ${user.userid}, Username: ${user.username}`;
        userItem.dataset.userid = user.userid;
        userItem.classList.add("user-item");

        // Add click event listener to each user item
        userItem.addEventListener("click", () => {
          const userId = user.userid;
          addUserToGroup(userId);
          // Remove user list container after adding user to group
          userListContainer.remove();
        });

        // Append user item to the user list container
        userListContainer.appendChild(userItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching all users:", error);
      alert("Error fetching all users");
    });
});

// Function to add user to group
function addUserToGroup(userId) {
  if (currentGroupId) {
    fetch("/add-to-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupid: currentGroupId, userid: userId }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        fetchGroupMembers(currentGroupId); // Refresh group members list and update UI
      })
      .catch((error) => {
        console.error("Error adding user to group:", error);
        alert("Error adding user to group");
      });
  } else {
    console.error("No current group selected");
    alert("No current group selected");
  }
}

// Function to send a group message
document
  .getElementById("groupMessageForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("groupMessageInput").value;
    if (messageInput.trim() === "") {
      return;
    }
    sendGroupMessage(messageInput);
    document.getElementById("groupMessageInput").value = "";
  });

// Function to send a group message
function sendGroupMessage(message) {
  const messageData = {
    message,
    timestamp: new Date().toISOString(),
  };
  if (currentGroupId) {
    socket.emit("group-message", { groupid: currentGroupId, messageData });
    // Display own message immediately
    displayGroupMessage(messageData, true);
  } else {
    console.error("No current group selected");
  }
}

// Example function to create a group message element
function createGroupMessageElement(message) {
  console.log("messages ...",message);

  // Check if message object or required properties are defined
  if (!message || !message.username) {
    console.error("Message or username is undefined");
    return null; // or handle gracefully as per your application logic
  }
  // Proceed with creating your message element
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  // Assuming you're displaying the username in the message element
  const usernameElement = document.createElement("div");
  usernameElement.classList.add("username");
  usernameElement.textContent = message.username;

  // Append username and message content to the message element
  messageElement.appendChild(usernameElement);

  // Return the created message element
  return messageElement;
}
// Example function to display group messages
function displayGroupMessage(message) {
  const messageElement = createGroupMessageElement(message);
  if (messageElement) {
    // Append the message element to the chat container
    const chatContainer = document.getElementById("chat-container");
    chatContainer.appendChild(messageElement);
  }
}

// Function to fetch group messages from server
function fetchGroupMessages(groupId, isInitialLoad = false) {
  fetch(
    `/group-messages?groupid=${groupId}&page=${groupMessagePage}&limit=${groupMessageLimit}`
  )
    .then((response) => response.json())
    .then((messages) => {
      const groupMessages = document.getElementById("groupMessages");
      const scrollPosition =
        groupMessages.scrollHeight - groupMessages.scrollTop;

      messages.messages.forEach((message) => {
        const messageData = {
          sender: message.sender,
          message: message.message,
          timestamp: new Date(message.created_at),
        };

        if (isInitialLoad) {
          displayGroupMessage(messageData);
        } else {
          const messageElement = createGrupMessageElement(messageData);
          groupMessages.insertBefore(messageElement, groupMessages.firstChild);
        }
      });

      if (!isInitialLoad) {
        groupMessages.scrollTop = groupMessages.scrollHeight - scrollPosition;
      }
    })
    .catch((error) => {
      console.error("Error fetching group messages:", error);
    });
}

// Socket event to receive group message
socket.on("group-message", (messageData) => {
  if (currentGroupId === messageData.groupid) {
    displayGroupMessage(messageData, false);
  }
});

// Scroll event listener to load more group messages
document.getElementById("groupMessages").addEventListener("scroll", (event) => {
  const groupMessages = document.getElementById("groupMessages");
  if (groupMessages.scrollTop === 0) {
    groupMessagePage++;
    fetchGroupMessages(currentGroupId);
  }
});

// Back to main chat button event listener
document.getElementById("backToChatBtn").addEventListener("click", () => {
  showView("chatContainer");
});

// Initial setup: Show registration/login view
showView("registerContainer");
