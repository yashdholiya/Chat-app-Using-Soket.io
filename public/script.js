const socket = io();
let userId = "";
let username = "";
let currentRecipient = null;

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
  const views = [
    "registerContainer",
    "loginContainer",
    "chatContainer",
    "privateChatContainer",
  ];
  views.forEach((viewId) => {
    const viewElement = document.getElementById(viewId);
    if (viewElement) {
      viewElement.style.display = "none";
    }
  });
}

// Function to update user status (online/offline)
function updateUserStatus(username, status) {
  const onlineUsersList = document.getElementById("onlineUsersList");
  if (onlineUsersList) {
    const userItems = onlineUsersList.getElementsByTagName("li");
    for (let i = 0; i < userItems.length; i++) {
      const userItem = userItems[i];
      if (userItem.textContent.startsWith(username)) {
        userItem.textContent = `${username} (${status}) `;
        break;
      }
    }
  }
}

// Event listener for registration form submission
document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const userid = document.getElementById("regUserId").value.trim();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  registerUser(userid, username, password);
});

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const usernameInput = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  loginUser(usernameInput, password);
});

// Function to register a new user
function registerUser(userid, username, password) {
  fetch("http://localhost:2123/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userid, username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed.");
      }
      alert("Registration successful. Please log in.");
      showView("loginContainer");
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    });
}

// Function to log in an existing user
function loginUser(usernameInput, password) {
  fetch("http://localhost:2123/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: usernameInput, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.userid) {
        throw new Error("Login failed.");
      }
      userId = data.userid;
      username = usernameInput;
      showView("chatContainer");
      initializeChat();
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your username and password.");
    });
}

// Function to initialize chat functionality after login
function initializeChat() {
  fetch("http://localhost:2123/users")
    .then((response) => response.json())
    .then((users) => {
      const onlineUsersList = document.getElementById("onlineUsersList");
      if (onlineUsersList) {
        onlineUsersList.innerHTML = "";
        users.forEach((user) => {
          const userItem = document.createElement("li");
          userItem.textContent =
            user.username === username
              ? `${user.username} (You)`
              : user.username +
                (user.status === "online" ? " (Online)" : " (Offline)");
          if (user.status === "online" && user.username !== username) {
            userItem.addEventListener("click", () => {
              currentRecipient = user.username;
              openPrivateChat(user.username);
            });
          }
          onlineUsersList.appendChild(userItem);
        });
      } else {
        console.error("Element with ID 'onlineUsersList' not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });

  const allMessages = document.getElementById("messages");

  function appendMessage(messageData, isPrivate = false) {
    const div = document.createElement("div");
    div.className = messageData.user === username ? "sent" : "received";
    const p = document.createElement("p");
    p.textContent = `${messageData.user}: ${messageData.message}`;

    const timeSpan = document.createElement("span");
    timeSpan.className = "timestamp";
    timeSpan.innerText = messageData.timestamp;
    p.appendChild(timeSpan);
    0;
    div.appendChild(p);

    if (isPrivate) {
      const privateMessages = document.getElementById("privateMessages");
      if (privateMessages) {
        privateMessages.appendChild(div);
        privateMessages.scrollTop = privateMessages.scrollHeight;
      } else {
        console.error("Element with ID 'privateMessages' not found.");
      }
    } else {
      if (allMessages) {
        allMessages.appendChild(div);
        allMessages.scrollTop = allMessages.scrollHeight;
      } else {
        console.error("Element with ID 'messages' not found.");
      }
    }
  }

  function sendPrivateMessage() {
    const messageInput = document.getElementById("privateMessageInput");
    const message = messageInput.value.trim();
    if (message && currentRecipient) {
      const messageData = {
        user: username,
        message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      appendMessage(messageData, true);
      socket.emit("private-message", { to: currentRecipient, messageData });
      messageInput.value = "";
    }
  }

  // Event listener for private message form submission
  const privateMessageForm = document.getElementById("privateMessageForm");
  if (privateMessageForm) {
    privateMessageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendPrivateMessage();
    });
  } else {
    console.error("Element with ID 'privateMessageForm' not found.");
  }

  // Event listener for message form submission
  const messageForm = document.getElementById("messageForm");
  if (messageForm) {
    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const messageInput = document.getElementById("messageInput");
      const message = messageInput.value.trim();
      if (message) {
        const messageData = {
          user: username,
          message,
          timestamp: new Date().toLocaleTimeString(),
        };
        appendMessage(messageData);
        socket.emit("broadcast-message", messageData);
        messageInput.value = "";
      }
    });
  } else {
    console.error("Element with ID 'messageForm' not found.");
  }

  // Listen for private messages
  socket.on("private-message", (messageData) => {
    if (
      messageData.user === currentRecipient ||
      messageData.user === username
    ) {
      appendMessage(messageData, true);
    }
    console.log("Private message received:", messageData);
  });

  // Listen for user status updates (online/offline)
  socket.on("user-status-change", ({ username, status, duration }) => {
    updateUserStatus(username, status);

    if (status === "offline") {
      const offlineMessage = document.createElement("div");
      offlineMessage.textContent = `${username} went offline. Duration: ${duration} ms`;
      console.log("user ...", duration);
      // Append this message to a suitable container in your UI
      const offlineMessagesContainer = document.getElementById(
        "offlineMessagesContainer"
      );
      if (offlineMessagesContainer) {
        offlineMessagesContainer.appendChild(offlineMessage);
      } else {
        console.error("Element with ID 'offlineMessagesContainer' not found.");
      }
    }
  });

  // Join the chat room and notify the server
  socket.emit("joinRoom", { userId, username });
}

// Function to open a private chat view
function openPrivateChat(recipient) {
  showView("privateChatContainer");
  const privateRecipient = document.getElementById("privateRecipient");
  if (privateRecipient) {
    privateRecipient.textContent = recipient;
  } else {
    console.error("Element with ID 'privateRecipient' not found.");
  }
}
// Initial view setup
showView("registerContainer");

// // Function to open a private chat view
// function openPrivateChat(recipient) {
//   showView("privateChatContainer");
//   document.getElementById("privateRecipient").textContent = recipient;
//   clearPrivateChatListeners();
// }

// // Function to clear private chat related listeners
// function clearPrivateChatListeners() {
//   socket.off("private-message");
// }
// Event listener for the back button in the private chat container


