// const socket = io();
// let userId = "";
// let username = "";
// let currentRecipient = null;

// // Function to switch between registration, login, chat, and private chat views
// function showView(viewId) {
//   hideAllViews();
//   const viewElement = document.getElementById(viewId);
//   if (viewElement) {
//     viewElement.style.display = "block";
//   } else {
//     console.error(`Element with ID ${viewId} not found.`);
//   }
// }

// // Helper function to hide all views
// function hideAllViews() {
//   document.getElementById("registerContainer").style.display = "none";
//   document.getElementById("loginContainer").style.display = "none";
//   document.getElementById("chatContainer").style.display = "none";
//   document.getElementById("privateChatContainer").style.display = "none";
// }

// // Example check for form submission
// document.getElementById("registerForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const regUserId = document.getElementById("regUserId").value;
//   const regUsername = document.getElementById("regUsername").value;
//   const regPassword = document.getElementById("regPassword").value;

//   if (
//     regUserId.trim() === "" ||
//     regUsername.trim() === "" ||
//     regPassword.trim() === ""
//   ) {
//     alert("Please fill in all required fields.");
//     return;
//   }

//   // Proceed with form submission
//   fetch("/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       userid: regUserId,
//       username: regUsername,
//       password: regPassword,
//     }),
//   })
//     .then((response) => response.text())
//     .then((data) => {
//       alert(data);
//     })
//     .catch((error) => {
//       console.error("Error registering user:", error);
//       alert("Error registering user");
//     });
// });

// // Event listener for login form submission
// document.getElementById("loginForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const loginUsername = document.getElementById("loginUsername").value;
//   const loginPassword = document.getElementById("loginPassword").value;

//   fetch("/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: loginUsername,
//       password: loginPassword,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(data.message);
//       userId = data.userid;
//       username = data.username;
//       document.getElementById("currentUser").textContent = username;
//       showView("chatContainer");
//       socket.emit("joinRoom", { userId, username });
//     })
//     .catch((error) => {
//       console.error("Error logging in:", error);
//       alert("Invalid username or password");
//     });
// });

// // Event listener for sending private messages
// document
//   .getElementById("privateMessageForm")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();
//     const messageInput = document.getElementById("privateMessageInput").value;
//     if (messageInput.trim() === "") {
//       return;
//     }
//     sendPrivateMessage(currentRecipient, messageInput);
//     document.getElementById("privateMessageInput").value = "";
//   });

// // Event listener for back to chat button in private chat view
// document.getElementById("backToChatBtn").addEventListener("click", () => {
//   showView("chatContainer");
//   currentRecipient = null;
//   document.getElementById("privateMessages").innerHTML = "";
// });

// // Function to send a private message to another user
// function sendPrivateMessage(to, message) {
//   const messageData = { user: username, message, timestamp: new Date() };
//   socket.emit("private-message", { to, messageData });
//   displayPrivateMessage(messageData, true);
//   console.log("private message s...".message);
// }
// function displayPrivateMessage(messageData, isSender) {
//   const privateMessages = document.getElementById("privateMessages");
//   const messageElement = document.createElement("div");
//   messageElement.className = `message ${isSender ? "sent" : "received"}`;
//   const timestamp =
//     messageData.timestamp instanceof Date
//       ? messageData.timestamp.toLocaleTimeString()
//       : "";
//   messageElement.innerHTML = `
//     <div class="message-user">${messageData.user}</div>
//     <div class="message-content">${messageData.message}</div>
//     <div class="message-timestamp">${timestamp}</div>
//   `;
//   privateMessages.appendChild(messageElement);
//   privateMessages.scrollTop = privateMessages.scrollHeight;
// }

// // Socket event to update online users list
// socket.on("update-users", (users) => {
//   const onlineUsersList = document.getElementById("onlineUsersList");
//   onlineUsersList.innerHTML = "";
//   users.forEach((user) => {
//     const userElement = document.createElement("li");
//     userElement.textContent = `${user.username} (${user.status})`;
//     userElement.addEventListener("click", () => {
//       if (user.userid !== userId) {
//         currentRecipient = user.username;
//         document.getElementById(
//           "privateChatWith"
//         ).textContent = `Chat with ${user.username}`;
//         fetchPrivateMessages(user.username);
//         showView("privateChatContainer");
//       }
//     });
//     onlineUsersList.appendChild(userElement);
//   });
// });

// // Function to fetch and display private messages between the user and the recipient
// function fetchPrivateMessages(recipient) {
//   fetch(
//     `http://localhost:2123/messages?sender=${username}&recipient=${recipient}`
//   )
//     .then((response) => response.json())
//     .then((messages) => {
//       messages.forEach((message) => {
//         const messageData = {
//           user: message.sender,
//           message: message.message,
//           timestamp: new Date(message.created_at), // Ensure this is a Date object
//         };
//         displayPrivateMessage(messageData, message.sender === username);
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching private messages:", error);
//     });
// }

// // Socket event to receive private message
// socket.on("private-message", (messageData) => {
//   if (currentRecipient === messageData.user || username === messageData.user) {
//     displayPrivateMessage(messageData, false);
//   }
// });

// // Socket event to handle user status change
// socket.on("user-status-change", ({ username, status, disconnectTime }) => {
//   const statusChangeMessage = `${username} is now ${status}`;
//   console.log(statusChangeMessage);

//   // Update UI to reflect user status change (optional)
// });

// // Initial setup: Show registration/login view
// showView("registerContainer");
/*                                                                       this is chat real code                                                                       */

// const socket = io();
// let userId = "";
// let username = "";
// let currentRecipient = null;

// // Function to switch between registration, login, chat, and private chat views
// function showView(viewId) {
//   hideAllViews();
//   const viewElement = document.getElementById(viewId);
//   if (viewElement) {
//     viewElement.style.display = "block";
//   } else {
//     console.error(`Element with ID ${viewId} not found.`);
//   }
// }

// // Helper function to hide all views
// function hideAllViews() {
//   document.getElementById("registerContainer").style.display = "none";
//   document.getElementById("loginContainer").style.display = "none";
//   document.getElementById("chatContainer").style.display = "none";
//   document.getElementById("privateChatContainer").style.display = "none";
// }

// // Example check for form submission
// document.getElementById("registerForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const regUserId = document.getElementById("regUserId").value;
//   const regUsername = document.getElementById("regUsername").value;
//   const regPassword = document.getElementById("regPassword").value;

//   if (
//     regUserId.trim() === "" ||
//     regUsername.trim() === "" ||
//     regPassword.trim() === ""
//   ) {
//     alert("Please fill in all required fields.");
//     return;
//   }

//   // Proceed with form submission
//   fetch("/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       userid: regUserId,
//       username: regUsername,
//       password: regPassword,
//     }),
//   })
//     .then((response) => response.text())
//     .then((data) => {
//       alert(data);
//     })
//     .catch((error) => {
//       console.error("Error registering user:", error);
//       alert("Error registering user");
//     });
// });

// // Event listener for login form submission
// document.getElementById("loginForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const loginUsername = document.getElementById("loginUsername").value;
//   const loginPassword = document.getElementById("loginPassword").value;

//   fetch("/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: loginUsername,
//       password: loginPassword,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(data.message);
//       userId = data.userid;
//       username = data.username;
//       document.getElementById("currentUser").textContent = username;
//       showView("chatContainer");
//       socket.emit("joinRoom", { userId, username });
//     })
//     .catch((error) => {
//       console.error("Error logging in:", error);
//       alert("Invalid username or password");
//     });
// });

// // Event listener for sending private messages
// document
//   .getElementById("privateMessageForm")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();
//     const messageInput = document.getElementById("privateMessageInput").value;
//     if (messageInput.trim() === "") {
//       return;
//     }
//     sendPrivateMessage(currentRecipient, messageInput);
//     document.getElementById("privateMessageInput").value = "";
//   });

// // Event listener for back to chat button in private chat view
// document.getElementById("backToChatBtn").addEventListener("click", () => {
//   showView("chatContainer");
//   currentRecipient = null;
//   document.getElementById("privateMessages").innerHTML = "";
// });

// // Function to send a private message to another user
// function sendPrivateMessage(to, message) {
//   const messageData = {
//     user: username,
//     message,
//     timestamp: new Date().toISOString(),
//   };
//   socket.emit("private-message", { to, messageData });
//   displayPrivateMessage(messageData, true);
//   console.log("private message s...", message);
// }

// function displayPrivateMessage(messageData, isSender) {
//   const privateMessages = document.getElementById("privateMessages");
//   const messageElement = document.createElement("div");
//   messageElement.className = `message ${isSender ? "sent" : "received"}`;
//   const timestamp = new Date(messageData.timestamp).toLocaleTimeString();
//   messageElement.innerHTML = `
//     <div class="message-user">${messageData.user}</div>
//     <div class="message-content">${messageData.message}</div>
//     <div class="message-timestamp">${timestamp}</div>
//   `;
//   privateMessages.appendChild(messageElement);
//   privateMessages.scrollTop = privateMessages.scrollHeight;
// }

// // Socket event to update online users list
// socket.on("update-users", (users) => {
//   const onlineUsersList = document.getElementById("onlineUsersList");
//   onlineUsersList.innerHTML = "";
//   users.forEach((user) => {
//     const userElement = document.createElement("li");
//     userElement.textContent = `${user.username} (${user.status})`;
//     userElement.addEventListener("click", () => {
//       if (user.userid !== userId) {
//         currentRecipient = user.username;
//         document.getElementById(
//           "privateChatWith"
//         ).textContent = `Chat with ${user.username}`;
//         fetchPrivateMessages(user.username);
//         showView("privateChatContainer");
//       }
//     });
//     onlineUsersList.appendChild(userElement);
//   });
// });

// //Function to fetch and display private messages between the user and the recipient
// function fetchPrivateMessages(recipient) {
//   fetch(
//     `http://localhost:2123/messages?sender=${username}&recipient=${recipient}`
//   )
//     .then((response) => response.json())
//     .then((messages) => {
//       messages.forEach((message) => {
//         const messageData = {
//           user: message.sender,
//           message: message.message,
//           timestamp: new Date(message.created_at), // Ensure this is a Date object
//         };
//         displayPrivateMessage(messageData, message.sender === username);
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching private messages:", error);
//     });
// }

// // Socket event to receive private message
// socket.on("private-message", (messageData) => {
//   if (currentRecipient === messageData.user || username === messageData.user) {
//     displayPrivateMessage(messageData, false);
//   }
// });

// // Socket event to handle user status change
// socket.on("user-status-change", ({ username, status, disconnectTime }) => {
//   const statusChangeMessage = `${username} is now ${status}`;
//   console.log(statusChangeMessage);

//   // Update UI to reflect user status change (optional)
// });

// // Initial setup: Show registration/login view
// showView("registerContainer");

const socket = io();
let userId = "";
let username = "";
let currentRecipient = null;
let currentMessages = []; // To store fetched messages
let currentPage = 1; // Current page number for pagination
const pageSize = 10; // Number of messages to fetch per page

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

function displayPrivateMessage(messageData, isSender) {
  const privateMessages = document.getElementById("privateMessages");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isSender ? "sent" : "received"}`;
  const timestamp = new Date(messageData.timestamp).toLocaleTimeString();
  messageElement.innerHTML = `
    <div class="message-user">${messageData.user}</div>
    <div class="message-content">${messageData.message}</div>
    <div class="message-timestamp">${timestamp}</div>
  `;
  privateMessages.appendChild(messageElement);
  privateMessages.scrollTop = privateMessages.scrollHeight;
}

// Function to fetch and display private messages between the user and the recipient
function fetchPrivateMessages(recipient, page = 1, pageSize = 10) {
  fetch(
    `/messages?sender=${username}&recipient=${recipient}&page=${page}&pageSize=${pageSize}`
  )
    .then((response) => response.json())
    .then((messages) => {
      // Reverse the messages array to display in ascending order
      const reversedMessages = messages.reverse();
      displayFetchedMessages(reversedMessages);
    })
    .catch((error) => {
      console.error("Error fetching private messages:", error);
    });
}

// Function to display messages in the chat interface
function displayFetchedMessages(messages) {
  const privateMessages = document.getElementById("privateMessages");
  privateMessages.innerHTML = "";

  messages.forEach((message) => {
    const messageData = {
      user: message.sender,
      message: message.message,
      timestamp: new Date(message.created_at),
    };
    displayPrivateMessage(messageData, message.sender === username);
  });

  privateMessages.scrollTop = privateMessages.scrollHeight;
}

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

// Socket event to receive private message
socket.on("private-message", (messageData) => {
  if (currentRecipient === messageData.user || username === messageData.user) {
    displayPrivateMessage(messageData, false);
  }
});

// Socket event to handle user status change
socket.on("user-status-change", ({ username, status, disconnectTime }) => {
  const statusChangeMessage = `${username} is now ${status}`;
  console.log(statusChangeMessage);

  // Update UI to reflect user status change (optional)
});

// Initial setup: Show registration/login view
showView("registerContainer");
