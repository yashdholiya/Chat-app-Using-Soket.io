// const socket = io();
// let userId = "";
// let username = "";
// let currentRecipient = null;
// let currentGroup = null;

// function showView(viewId) {
//   hideAllViews();
//   const viewElement = document.getElementById(viewId);
//   if (viewElement) {
//     viewElement.style.display = "block";
//   } else {
//     console.error(`Element with ID ${viewId} not found.`);
//   }
// }

// function hideAllViews() {
//   const views = [
//     "registerContainer",
//     "loginContainer",
//     "chatContainer",
//     "privateChatContainer",
//     "groupChatContainer",
//   ];
//   views.forEach((viewId) => {
//     const viewElement = document.getElementById(viewId);
//     if (viewElement) {
//       viewElement.style.display = "none";
//     }
//   });
// }

// document.getElementById("registerForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const userid = document.getElementById("regUserId").value.trim();
//   const username = document.getElementById("regUsername").value.trim();
//   const password = document.getElementById("regPassword").value.trim();
//   registerUser(userid, username, password);
// });

// document.getElementById("loginForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const usernameInput = document.getElementById("loginUsername").value.trim();
//   const password = document.getElementById("loginPassword").value.trim();
//   loginUser(usernameInput, password);
// });

// function registerUser(userid, username, password) {
//   fetch("http://localhost:2123/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userid, username, password }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Registration failed.");
//       }
//       alert("Registration successful. Please log in.");
//       showView("loginContainer");
//     })
//     .catch((error) => {
//       console.error("Error registering user:", error);
//       alert("Registration failed. Please try again.");
//     });
// }

// function loginUser(usernameInput, password) {
//   fetch("http://localhost:2123/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username: usernameInput, password }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (!data.userid) {
//         throw new Error("Login failed.");
//       }
//       userId = data.userid;
//       username = usernameInput;
//       showView("chatContainer");
//       initializeChat();
//     })
//     .catch((error) => {
//       console.error("Error logging in:", error);
//       alert("Login failed. Please check your username and password.");
//     });
// }

// function initializeChat() {
//   fetch("http://localhost:2123/users")
//     .then((response) => response.json())
//     .then((users) => {
//       const onlineUsersList = document.getElementById("onlineUsersList");
//       if (onlineUsersList) {
//         onlineUsersList.innerHTML = "";
//         users.forEach((user) => {
//           const userItem = document.createElement("li");
//           if (user.username === username) {
//             userItem.textContent = `${user.username} (You)`;
//           } else if (user.status === "online") {
//             userItem.textContent = `${user.username} (Online)`;
//           } else {
//             const lastSeenTime = new Date(user.last_seen).getTime();
//             const currentTime = new Date().getTime();
//             const offlineDuration = currentTime - lastSeenTime;

//             if (isNaN(offlineDuration)) {
//               userItem.textContent = `${user.username} (Offline)`;
//             } else {
//               const hours = Math.floor(offlineDuration / (60 * 60 * 1000));
//               const minutes = Math.floor(
//                 (offlineDuration % (60 * 60 * 1000)) / (60 * 1000)
//               );
//               userItem.textContent = `${user.username} (Offline for ${hours}h ${minutes}m)`;
//             }
//           }

//           if (user.status === "online" && user.username !== username) {
//             userItem.addEventListener("click", () => {
//               currentRecipient = user.username;
//               openPrivateChat(user.username);
//             });
//           }
//           onlineUsersList.appendChild(userItem);
//         });
//       } else {
//         console.error("Element with ID 'onlineUsersList' not found.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching users:", error);
//     });

//   const allMessages = document.getElementById("messages");

//   function appendMessage(messageData, isPrivate = false, isGroup = false) {
//     const div = document.createElement("div");
//     div.className = messageData.user === username ? "sent" : "received";
//     const p = document.createElement("p");
//     p.textContent = `${messageData.user}: ${messageData.message}`;

//     const timeSpan = document.createElement("span");
//     timeSpan.className = "timestamp";
//     timeSpan.innerText = messageData.timestamp;
//     p.appendChild(timeSpan);
//     div.appendChild(p);

//     if (isPrivate) {
//       const privateMessages = document.getElementById("privateMessages");
//       if (privateMessages) {
//         privateMessages.appendChild(div);
//         privateMessages.scrollTop = privateMessages.scrollHeight;
//       } else {
//         console.error("Element with ID 'privateMessages' not found.");
//       }
//     } else if (isGroup) {
//       const groupMessages = document.getElementById("groupMessages");
//       if (groupMessages) {
//         groupMessages.appendChild(div);
//         groupMessages.scrollTop = groupMessages.scrollHeight;
//       } else {
//         console.error("Element with ID 'groupMessages' not found.");
//       }
//     } else {
//       if (allMessages) {
//         allMessages.appendChild(div);
//         allMessages.scrollTop = allMessages.scrollHeight;
//       } else {
//         console.error("Element with ID 'messages' not found.");
//       }
//     }
//   }

//   function sendPrivateMessage() {
//     const messageInput = document.getElementById("privateMessageInput");
//     const message = messageInput.value.trim();
//     if (message && currentRecipient) {
//       const messageData = {
//         user: username,
//         message,
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//         }),
//       };
//       appendMessage(messageData, true);
//       socket.emit("private-message", { to: currentRecipient, messageData });
//       messageInput.value = "";
//     }
//   }

//   function sendGroupMessage() {
//     const messageInput = document.getElementById("groupMessageInput");
//     const message = messageInput.value.trim();
//     if (message && currentGroup) {
//       const messageData = {
//         user: username,
//         message,
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//         }),
//       };
//       appendMessage(messageData, false, true);
//       socket.emit("group-message", { to: currentGroup, messageData });
//       messageInput.value = "";
//     }
//   }

//   const privateMessageForm = document.getElementById("privateMessageForm");
//   if (privateMessageForm) {
//     privateMessageForm.addEventListener("submit", (event) => {
//       event.preventDefault();
//       sendPrivateMessage();
//     });
//   } else {
//     console.error("Element with ID 'privateMessageForm' not found.");
//   }

//   const groupMessageForm = document.getElementById("groupMessageForm");
//   if (groupMessageForm) {
//     groupMessageForm.addEventListener("submit", (event) => {
//       event.preventDefault();
//       sendGroupMessage();
//     });
//   } else {
//     console.error("Element with ID 'groupMessageForm' not found.");
//   }

//   const messageForm = document.getElementById("messageForm");
//   if (messageForm) {
//     messageForm.addEventListener("submit", (event) => {
//       event.preventDefault();
//       const messageInput = document.getElementById("messageInput");
//       const message = messageInput.value.trim();
//       if (message) {
//         const messageData = {
//           user: username,
//           message,
//           timestamp: new Date().toLocaleTimeString(),
//         };
//         appendMessage(messageData);
//         socket.emit("broadcast-message", messageData);
//         messageInput.value = "";
//       }
//     });
//   } else {
//     console.error("Element with ID 'messageForm' not found.");
//   }

//   socket.on("private-message", (messageData) => {
//     if (
//       messageData.user === currentRecipient ||
//       messageData.user === username
//     ) {
//       appendMessage(messageData, true);
//     }
//     console.log("Private message received:", messageData);
//   });

//   socket.on("group-message", (messageData) => {
//     if (messageData.user !== username) {
//       appendMessage(messageData, false, true);
//     }
//     console.log("Group message received:", messageData);
//   });

//   socket.on("user-status-change", ({ username, status, disconnectTime }) => {
//     const onlineUsersList = document.getElementById("onlineUsersList");
//     if (onlineUsersList) {
//       const userItems = onlineUsersList.getElementsByTagName("li");
//       for (let i = 0; i < userItems.length; i++) {
//         const userItem = userItems[i];
//         if (userItem.textContent.startsWith(username)) {
//           if (status === "offline" && disconnectTime) {
//             const lastSeenTime = new Date(disconnectTime).getTime();
//             const currentTime = new Date().getTime();
//             const offlineDuration = currentTime - lastSeenTime;

//             if (isNaN(offlineDuration)) {
//               userItem.textContent = `${username} (Offline)`;
//             } else {
//               const hours = Math.floor(offlineDuration / (60 * 60 * 1000));
//               const minutes = Math.floor(
//                 (offlineDuration % (60 * 60 * 1000)) / (60 * 1000)
//               );
//               userItem.textContent = `${username} (Offline for ${hours}h ${minutes}m)`;
//             }
//           } else if (status === "online") {
//             userItem.textContent = `${username} (Online)`;
//             userItem.addEventListener("click", () => {
//               currentRecipient = username;
//               openPrivateChat(username);
//             });
//           }
//         }
//       }
//     } else {
//       console.error("Element with ID 'onlineUsersList' not found.");
//     }
//   });

//   socket.emit("user-status-change", {
//     userId,
//     username,
//     status: "online",
//   });
// }

// window.addEventListener("beforeunload", () => {
//   socket.emit("user-status-change", {
//     userId,
//     username,
//     status: "offline",
//   });
// });

// function openPrivateChat(recipient) {
//   showView("privateChatContainer");
//   document.getElementById("privateRecipient").textContent = recipient;
//   currentRecipient = recipient;
//   const privateMessages = document.getElementById("privateMessages");
//   if (privateMessages) {
//     privateMessages.innerHTML = "";
//   } else {
//     console.error("Element with ID 'privateMessages' not found.");
//   }
// }

// function openGroupChat(group) {
//   showView("groupChatContainer");
//   document.getElementById("groupName").textContent = group;
//   currentGroup = group;
//   const groupMessages = document.getElementById("groupMessages");
//   if (groupMessages) {
//     groupMessages.innerHTML = "";
//   } else {
//     console.error("Element with ID 'groupMessages' not found.");
//   }
// }
// // // Initial view setup
// showView("registerContainer");

/*
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
        userItem.textContent = `${username} (${status})`;
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

// Function to initialize chat and load users
function initializeChat() {
  fetch("http://localhost:2123/users")
    .then((response) => response.json())
    .then((users) => {
      const onlineUsersList = document.getElementById("onlineUsersList");
      if (onlineUsersList) {
        onlineUsersList.innerHTML = "";
        users.forEach((user) => {
          const userItem = document.createElement("li");
          if (user.username === username) {
            userItem.textContent = `${user.username} (You)`;
          } else if (user.status === "online") {
            userItem.textContent = `${user.username} (Online)`;
          } else {
            const lastSeenTime = new Date(user.last_seen).getTime();
            const currentTime = new Date().getTime();
            const offlineDuration = currentTime - lastSeenTime;

            if (isNaN(offlineDuration)) {
              userItem.textContent = `${user.username} (Offline)`;
            } else {
              const hours = Math.floor(offlineDuration / (60 * 60 * 1000));
              const minutes = Math.floor(
                (offlineDuration % (60 * 60 * 1000)) / (60 * 1000)
              );
              userItem.textContent = `${user.username} (Offline for ${hours}h ${minutes}m)`;
            }
          }

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

  socket.on("user-status-change", ({ username, status, disconnectTime }) => {
    const onlineUsersList = document.getElementById("onlineUsersList");
    if (onlineUsersList) {
      // Update user status and offline duration
      const userItems = onlineUsersList.getElementsByTagName("li");
      for (let i = 0; i < userItems.length; i++) {
        const userItem = userItems[i];
        if (userItem.textContent.startsWith(username)) {
          if (status === "offline") {
            const lastSeenTime = new Date(disconnectTime).getTime();
            const currentTime = new Date().getTime();
            const offlineDuration = currentTime - lastSeenTime;

            if (isNaN(offlineDuration)) {
              userItem.textContent = `${username} (Offline)`;
            } else {
              const hours = Math.floor(offlineDuration / (60 * 60 * 1000));
              const minutes = Math.floor(
                (offlineDuration % (60 * 60 * 1000)) / (60 * 1000)
              );
              userItem.textContent = `${username} (Offline for ${hours}h ${minutes}m)`;
            }
          } else {
            userItem.textContent = `${username} (Online)`;
          }
          break;
        }
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

    fetchMessages(username, recipient);
  }
}
// Function to fetch messages between the logged-in user and the recipient
function fetchMessages(sender, recipient) {
  fetch(
    `http://localhost:2123/messages?sender=${sender}&recipient=${recipient}`
  )
    .then((response) => response.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        console.log("Fetched messages:", data);
        displayMessages(data);
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Raw response:", text);
      }
    })
    .catch((error) => {
      console.error("Error fetching messages:", error);
    });
}

// Call this function when opening a private chat
// function openPrivateChat(recipient) {
//   showView("privateChatContainer");
//   const privateRecipient = document.getElementById("privateRecipient");
//   if (privateRecipient) {
//     privateRecipient.textContent = recipient;
//   } else {
//     console.error("Element with ID 'privateRecipient' not found.");
//   }

//   // Fetch and display messages between the logged-in user and the recipient
//   fetchMessages(username, recipient);
// }

// Initial view setup
showView("registerContainer");
*/

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
//   const views = [
//     "registerContainer",
//     "loginContainer",
//     "chatContainer",
//     "privateChatContainer",
//   ];
//   views.forEach((viewId) => {
//     const viewElement = document.getElementById(viewId);
//     if (viewElement) {
//       viewElement.style.display = "none";
//     }
//   });
// }

// // Function to update user status (online/offline)
// function updateUserStatus(username, status) {
//   const onlineUsersList = document.getElementById("onlineUsersList");
//   if (onlineUsersList) {
//     const userItems = onlineUsersList.getElementsByTagName("li");
//     for (let i = 0; i < userItems.length; i++) {
//       const userItem = userItems[i];
//       if (userItem.textContent.startsWith(username)) {
//         userItem.textContent = `${username} (${status})`;
//         break;
//       }
//     }
//   }
// }

// // Event listener for registration form submission
// document.getElementById("registerForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const userid = document.getElementById("regUserId").value.trim();
//   const username = document.getElementById("regUsername").value.trim();
//   const password = document.getElementById("regPassword").value.trim();
//   registerUser(userid, username, password);
// });

// // Event listener for login form submission
// document.getElementById("loginForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const usernameInput = document.getElementById("loginUsername").value.trim();
//   const password = document.getElementById("loginPassword").value.trim();
//   loginUser(usernameInput, password);
// });

// // Function to register a new user
// function registerUser(userid, username, password) {
//   fetch("http://localhost:2123/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userid, username, password }),
//   })
//     .then((response) => {
//       if (response.ok) {
//         showView("loginContainer");
//         alert("Registration successful. Please log in.");
//       } else {
//         alert("Registration failed. Please try again.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error registering user:", error);
//     });
// }

// // Function to log in an existing user
// function loginUser(usernameInput, password) {
//   fetch("http://localhost:2123/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username: usernameInput, password }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.message === "Login successful") {
//         userId = data.userid;
//         username = data.username;
//         socket.emit("joinRoom", { userId, username });
//         showView("chatContainer");
//         document.getElementById("currentUser").textContent = username;
//         fetchOnlineUsers();
//       } else {
//         alert("Login failed. Please check your credentials.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error logging in:", error);
//     });
// }

// // Function to fetch online users and display them in the list
// function fetchOnlineUsers() {
//   fetch("http://localhost:2123/users")
//     .then((response) => response.json())
//     .then((users) => {
//       const onlineUsersList = document.getElementById("onlineUsersList");
//       onlineUsersList.innerHTML = "";
//       users.forEach((user) => {
//         if (user.status === "online" && user.username !== username) {
//           const userItem = document.createElement("li");
//           userItem.textContent = user.username;
//           userItem.addEventListener("click", () => {
//             openPrivateChat(user.username);
//           });
//           onlineUsersList.appendChild(userItem);
//         }
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching online users:", error);
//     });
// }

// // Function to send a private message to another user
// function sendPrivateMessage(to, message) {
//   const messageData = { user: username, message, timestamp: new Date() };
//   socket.emit("private-message", { to, messageData });
//   displayPrivateMessage(messageData, true);
// }

// // Function to open a private chat with another user
// function openPrivateChat(recipient) {
//   currentRecipient = recipient;
//   showView("privateChatContainer");
//   document.getElementById(
//     "privateChatWith"
//   ).textContent = `Chat with ${recipient}`;
//   document.getElementById("privateMessages").innerHTML = "";
//   fetchPrivateMessages(recipient);

//   const privateMessageForm = document.getElementById("privateMessageForm");
//   privateMessageForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const privateMessageInput = document.getElementById("privateMessageInput");
//     const message = privateMessageInput.value.trim();
//     if (message) {
//       sendPrivateMessage(recipient, message);
//       privateMessageInput.value = "";
//     }
//   });
// }

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

// // Function to display a private message in the chat interface
// function displayPrivateMessage(messageData, isSender) {
//   const privateMessages = document.getElementById("privateMessages");
//   const messageElement = document.createElement("div");
//   messageElement.className = `message ${isSender ? "sent" : "received"}`;
//   messageElement.innerHTML = `
//     <div class="message-user">${messageData.user}</div>
//     <div class="message-content">${messageData.message}</div>
//     <div class="message-timestamp">${messageData.timestamp.toLocaleTimeString()}</div>
//   `;
//   console.log("send messages....", privateMessages);
//   privateMessages.appendChild(messageElement);
//   privateMessages.scrollTop = privateMessages.scrollHeight;
// }

// // Event listener for receiving private messages
// socket.on("private-message", (messageData) => {
//   if (messageData.user === currentRecipient) {
//     displayPrivateMessage(messageData, false);
//   }
// });

// // Event listener for updating online users list
// socket.on("update-users", (users) => {
//   const onlineUsersList = document.getElementById("onlineUsersList");
//   onlineUsersList.innerHTML = "";
//   users.forEach((user) => {
//     if (user.status === "online" && user.username !== username) {
//       const userItem = document.createElement("li");
//       userItem.textContent = user.username;
//       userItem.addEventListener("click", () => {
//         openPrivateChat(user.username);
//       });
//       onlineUsersList.appendChild(userItem);
//     }
//   });
// });

// // Event listener for updating user status
// socket.on("user-status-change", ({ username, status, disconnectTime }) => {
//   updateUserStatus(username, status);
//   if (status === "offline") {
//     console.log(
//       `${username} went offline at ${new Date(
//         disconnectTime
//       ).toLocaleTimeString()}`
//     );
//   }
// });

// // Function to return to the main chat page
// document.getElementById("backToChatBtn").addEventListener("click", () => {
//   showView("chatContainer");
// });

// // Initial view setup
// showView("registerContainer");
// client.js

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

// // Event listener for registration form submission
// document.getElementById("registerForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const regUserId = document.getElementById("regUserId").value;
//   const regUsername = document.getElementById("regUsername").value;
//   const regPassword = document.getElementById("regPassword").value;

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
// }

// // Function to display a private message in the chat interface
// function displayPrivateMessage(messageData, isSender) {
//   const privateMessages = document.getElementById("privateMessages");
//   const messageElement = document.createElement("div");
//   messageElement.className = `message ${isSender ? "sent" : "received"}`;
//   messageElement.innerHTML = `
//     <div class="message-user">${messageData.user}</div>
//     <div class="message-content">${messageData.message}</div>
//     <div class="message-timestamp">${messageData.timestamp.toLocaleTimeString()}</div>
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
  const messageData = { user: username, message, timestamp: new Date() };
  socket.emit("private-message", { to, messageData });
  displayPrivateMessage(messageData, true);
}

// Function to display a private message in the chat interface
// function displayPrivateMessage(messageData, isSender) {
//   const privateMessages = document.getElementById("privateMessages");
//   const messageElement = document.createElement("div");
//   messageElement.className = `message ${isSender ? "sent" : "received"}`;
//   messageElement.innerHTML = `
//     <div class="message-user">${messageData.user}</div>
//     <div class="message-content">${messageData.message}</div>
//     <div class="message-timestamp">${messageData.timestamp.toLocaleTimeString()}</div>
//   `;
//   privateMessages.appendChild(messageElement);
//   privateMessages.scrollTop = privateMessages.scrollHeight;
// }
function displayPrivateMessage(messageData, isSender) {
  const privateMessages = document.getElementById("privateMessages");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isSender ? "sent" : "received"}`;
  const timestamp =
    messageData.timestamp instanceof Date
      ? messageData.timestamp.toLocaleTimeString()
      : "";
  messageElement.innerHTML = `
    <div class="message-user">${messageData.user}</div>
    <div class="message-content">${messageData.message}</div>
    <div class="message-timestamp">${timestamp}</div>
  `;
  privateMessages.appendChild(messageElement);
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

// Function to fetch and display private messages between the user and the recipient
function fetchPrivateMessages(recipient) {
  fetch(
    `http://localhost:2123/messages?sender=${username}&recipient=${recipient}`
  )
    .then((response) => response.json())
    .then((messages) => {
      messages.forEach((message) => {
        const messageData = {
          user: message.sender,
          message: message.message,
          timestamp: new Date(message.created_at), // Ensure this is a Date object
        };
        displayPrivateMessage(messageData, message.sender === username);
      });
    })
    .catch((error) => {
      console.error("Error fetching private messages:", error);
    });
}

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
