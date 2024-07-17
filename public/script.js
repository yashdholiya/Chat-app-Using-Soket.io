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

// const socket = io();
// let userId = "";
// let username = "";
// let currentRecipient = null;
// let currentPage = 1;
// const limit = 10;

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
//   document.getElementById("registerContainer").style.display = "none";
//   document.getElementById("loginContainer").style.display = "none";
//   document.getElementById("chatContainer").style.display = "none";
//   document.getElementById("privateChatContainer").style.display = "none";
// }

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

// document.getElementById("backToChatBtn").addEventListener("click", () => {
//   showView("chatContainer");
//   currentRecipient = null;
//   document.getElementById("privateMessages").innerHTML = "";
//   currentPage = 1;
// });

// function sendPrivateMessage(to, message) {
//   const messageData = {
//     user: username,
//     message,
//     timestamp: new Date().toISOString(),
//   };
//   socket.emit("private-message", { to, messageData });
//   displayPrivateMessage(messageData, true);
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

//   // privateMessages.appendChild(messageElement);
//   privateMessages.prepend(messageElement);
//   privateMessages.scrollTop = privateMessages.scrollHeight;
// }

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
//         currentPage = 1;
//         document.getElementById("privateMessages").innerHTML = "";
//         fetchPrivateMessages(user.username);

//         +showView("privateChatContainer");
//       }
//     });
//     onlineUsersList.appendChild(userElement);
//   });
// });

// function fetchPrivateMessages(recipient) {
//   showLoader();
//   fetch(
//     `http://localhost:2123/messages?sender=${username}&recipient=${recipient}&page=${currentPage}&limit=${limit}`
//   )
//     .then((response) => response.json())
//     .then((messages) => {
//       if (messages.length > 0) {
//         messages.forEach((message) => {
//           const messageData = {
//             user: message.sender,
//             message: message.message,
//             timestamp: new Date(message.created_at),
//           };
//           displayPrivateMessage(messageData, message.sender === username);
//         });
//         currentPage++;
//         console.log("page ..", messages);
//       }
//       hideLoader();
//     })
//     .catch((error) => {
//       console.error("Error fetching private messages:", error);
//       hideLoader();
//     });
// }

// function showLoader() {
//   document.querySelector(".loader").classList.add("show");
// }

// function hideLoader() {
//   document.querySelector(".loader").classList.remove("show");
// }

// socket.on("private-message", (messageData) => {
//   if (currentRecipient === messageData.user || username === messageData.user) {
//     displayPrivateMessage(messageData, false);
//   }
// });

// document.getElementById("privateMessages").addEventListener("scroll", () => {
//   const { scrollTop, scrollHeight, clientHeight } =
//     document.getElementById("privateMessages");
//   if (scrollTop === 0 && currentRecipient) {
//     fetchPrivateMessages(currentRecipient);
//   }
// });
// // // Initial setup: Show registration/login view
// showView("registerContainer");

/*                                                                       this is chat real code   update pagination                                                                    */

// const socket = io();
// let userId = "";
// let username = "";
// let currentRecipient = null;
// let privateMessagePage = 1;
// const privateMessageLimit = 10;

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
//   privateMessagePage = 1; // Reset pagination to first page
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
// }

// // Function to display a private message
// function displayPrivateMessage(messageData, isSender) {
//   const privateMessages = document.getElementById("privateMessages");
//   const messageElement = createMessageElement(messageData, isSender);
//   privateMessages.appendChild(messageElement);
//   privateMessages.scrollTop = privateMessages.scrollHeight;
// }

// function fetchPrivateMessages(recipient, isInitialLoad = false) {
//   fetch(
//     `/messages?sender=${username}&recipient=${recipient}&page=${privateMessagePage}&limit=${privateMessageLimit}`
//   )
//     .then((response) => response.json())
//     .then((messages) => {
//       const privateMessages = document.getElementById("privateMessages");
//       const scrollPosition =
//         privateMessages.scrollHeight - privateMessages.scrollTop;

//       messages.messages.forEach((message) => {
//         const messageData = {
//           user: message.sender,
//           message: message.message,
//           timestamp: new Date(message.created_at),
//         };

//         // If it's the initial load, append messages at the bottom
//         if (isInitialLoad) {
//           displayPrivateMessage(messageData, message.sender === username);
//         } else {
//           // Otherwise, prepend messages at the top
//           const messageElement = createMessageElement(
//             messageData,
//             message.sender === username
//           );
//           privateMessages.insertBefore(
//             messageElement,
//             privateMessages.firstChild
//           );
//         }
//       });

//       if (!isInitialLoad) {
//         privateMessages.scrollTop =
//           privateMessages.scrollHeight - scrollPosition;
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching private messages:", error);
//     });
// }

// // // Function to create a message element
// // function createMessageElement(messageData, isSender) {
// //   const messageElement = document.createElement("div");
// //   messageElement.className = `message ${isSender ? "sent" : "received"}`;console.log("messages...",messageElement);
// //   const timestamp = new Date(messageData.timestamp). toLocaleTimeString();
// //   messageElement.innerHTML = `
// //     <div class="message-user">${messageData.user}</div>
// //     <div class="message-content">${messageData.message}</div>
// //     <div class="message-timestamp">${timestamp}</div>
// //   `;
// //   return messageElement;
// // }
// // Function to create a message element
// function createMessageElement(messageData, isSender) {
//   const messageElement = document.createElement("div");
//   messageElement.className = `message ${isSender ? "sent" : "received"}`;

//   // Adjust the timestamp by 4 hours
//   const timestamp = new Date(messageData.timestamp);
//   timestamp.setHours(timestamp.getHours() + 4);

//   const formattedTimestamp = timestamp.toLocaleTimeString();

//   messageElement.innerHTML = `
//     <div class="message-user">${messageData.user}</div>
//     <div class="message-content">${messageData.message}</div>
//     <div class="message-timestamp">${formattedTimestamp}</div>
//   `;
//   return messageElement;
// }

// // Socket event to receive private message
// socket.on("private-message", (messageData) => {
//   if (currentRecipient === messageData.user || username === messageData.user) {
//     displayPrivateMessage(messageData, false);
//   }
// });

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

// // Scroll event listener for loading more messages
// document
//   .getElementById("privateMessages")
//   .addEventListener("scroll", (event) => {
//     const privateMessages = document.getElementById("privateMessages");
//     if (privateMessages.scrollTop === 0) {
//       // Load more messages when scrolled to the top
//       privateMessagePage++;
//       fetchPrivateMessages(currentRecipient);
//     }
//   });

// // Initial setup: Show registration/login view
// showView("registerContainer");

const socket = io();
let userId = "";
let username = "";
let currentRecipient = null;
let privateMessagePage = 1;
const privateMessageLimit = 10;

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

//                                                                    grup chat                                                                  //
// Group chat functionality

// let currentGroupId = null;
// let groupMessagePage = 1;
// const groupMessageLimit = 10;

// // Create group button event listener
// document.getElementById("createGroupBtn").addEventListener("click", () => {
//   const groupName = prompt("Enter group name:");
//   if (groupName) {
//     fetch("/create-group", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ groupname: groupName }),
//     })
//       .then((response) => response.text())
//       .then((data) => {
//         alert(data);
//         // fetchGroups(); // Refresh the group list
//       })
//       .catch((error) => {
//         console.error("Error creating group:", error);
//         alert("Error creating group");
//       });
//   }
// });
// function displayGroupNames() {
//   fetch("/group-names")
//     .then((response) => response.json())
//     .then((groupNames) => {
//       const groupList = document.getElementById("groupList");
//       groupList.innerHTML = "";
//       groupNames.forEach((group) => {
//         const groupItem = document.createElement("li");
//         groupItem.textContent = `group ${group.groupname}`;
//         groupItem.dataset.groupid = group.groupid; // Add group ID for reference
//         groupList.appendChild(groupItem);
//         // console.log("........", group.groupid);

//         groupItem.addEventListener("click", () => {
//           currentGroupId = group.groupid;
//           // console.log("...........", currentGroupId);
//           showView("groupChatContainer");
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching group names:", error);
//     });
// }

// displayGroupNames();

// // Fetch all users and display in a list
// document.getElementById("addUserToGroupBtn").addEventListener("click", () => {
//   fetch("/users")
//     .then((response) => response.json())
//     .then((allUsers) => {
//       const userListContainer = document.createElement("div");
//       userListContainer.id = "userListContainer";
//       userListContainer.classList.add("user-list-container");
//       document.body.appendChild(userListContainer); // Append to body or any appropriate container

//       allUsers.forEach((user) => {
//         const userItem = document.createElement("div");
//         userItem.textContent = `User ID: ${user.userid}, Username: ${user.username}`;
//         userItem.dataset.userid = user.userid;
//         userItem.classList.add("user-item"); // Add a class for styling
//         userListContainer.appendChild(userItem);

//         // Add click event listener to each user item
//         userItem.addEventListener("click", () => {
//           const userId = user.userid;
//           addUserToGroup(userId);
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching all users:", error);
//       alert("Error fetching all users");
//     });
// });

// // // Function to add user to the group
// // function addUserToGroup(userId) {
// //   if (currentGroupId) {
// //     fetch("/add-to-group", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ groupid: currentGroupId, userid: userId }),
// //     })
// //       .then((response) => response.text())
// //       .then((data) => {
// //         alert(data);
// //       })
// //       .catch((error) => {
// //         console.error("Error adding user to group:", error);
// //         alert("Error adding user to group");
// //       });
// //   } else {
// //     console.error("No current group selected");
// //     alert("No current group selected");
// //   }
// // }
// // Function to add user to the group
// function addUserToGroup(userId) {
//   if (currentGroupId) {
//     fetch("/add-to-group", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ groupid: currentGroupId, userid: userId }),
//     })
//       .then((response) => response.text())
//       .then((data) => {
//         alert(data);

//         // Update group members list
//         fetch(`/group-members?groupid=${currentGroupId}`)
//           .then((response) => response.json())
//           .then((members) => {
//             updateGroupMembers(members);
//           })
//           .catch((error) => {
//             console.error("Error fetching group members:", error);
//           });

//         // Optionally, fetch or update group messages here if needed
//       })
//       .catch((error) => {
//         console.error("Error adding user to group:", error);
//         alert("Error adding user to group");
//       });
//   } else {
//     console.error("No current group selected");
//     alert("No current group selected");
//   }
// }

// // Group message form submission event listener
// document
//   .getElementById("groupMessageForm")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();
//     const messageInput = document.getElementById("groupMessageInput").value;
//     if (messageInput.trim() === "") {
//       return;
//     }
//     sendGroupMessage(messageInput); // Pass messageInput here
//     document.getElementById("groupMessageInput").value = "";
//   });

// // Function to send a group message
// function sendGroupMessage(message) {
//   const messageData = {
//     user: username,
//     message,
//     timestamp: new Date().toISOString(),
//   };
//   if (currentGroupId) {
//     socket.emit("group-message", { groupid: currentGroupId, messageData });
//     displayGroupMessage(messageData, true);
//   } else {
//     console.error("No current group selected");
//   }
// }

// // Function to display a group message
// function displayGroupMessage(messageData, isSender) {
//   const groupMessages = document.getElementById("groupMessages");
//   const messageElement = createMessageElement(messageData, isSender);
//   groupMessages.appendChild(messageElement);
//   groupMessages.scrollTop = groupMessages.scrollHeight;
// }

// // Function to fetch group messages
// function fetchGroupMessages(groupId, isInitialLoad = false) {
//   fetch(
//     `/group-messages?groupid=${groupId}&page=${groupMessagePage}&limit=${groupMessageLimit}`
//   )
//     .then((response) => response.json())
//     .then((messages) => {
//       const groupMessages = document.getElementById("groupMessages");
//       const scrollPosition =
//         groupMessages.scrollHeight - groupMessages.scrollTop;

//       messages.messages.forEach((message) => {
//         const messageData = {
//           user: message.sender,
//           message: message.message,
//           timestamp: new Date(message.created_at),
//         };

//         if (isInitialLoad) {
//           displayGroupMessage(messageData, message.sender === username);
//         } else {
//           const messageElement = createMessageElement(
//             messageData,
//             message.sender === username
//           );
//           groupMessages.insertBefore(messageElement, groupMessages.firstChild);
//         }
//       });

//       if (!isInitialLoad) {
//         groupMessages.scrollTop = groupMessages.scrollHeight - scrollPosition;
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching group messages:", error);
//     });
// }

// // Socket event to receive group message
// socket.on("group-message", (messageData) => {
//   if (currentGroupId === messageData.groupid) {
//     displayGroupMessage(messageData, false);
//   }
// });

// // Scroll event listener for loading more group messages
// document.getElementById("groupMessages").addEventListener("scroll", (event) => {
//   const groupMessages = document.getElementById("groupMessages");
//   if (groupMessages.scrollTop === 0) {
//     // Load more messages when scrolled to the top
//     groupMessagePage++;
//     fetchGroupMessages(currentGroupId);
//   }
// });
// document.getElementById("backToChatBtn").addEventListener("click", () => {
//   showView("chatContainer");
// });

// // // Initial setup: Show registration/login view
// showView("registerContainer");
// Global variables

let currentGroupId = null;
let groupMessagePage = 1;
const groupMessageLimit = 10;

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
        // Refresh group list
        displayGroupNames();
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
        groupItem.dataset.groupid = group.groupid; // Store group ID
        groupList.appendChild(groupItem);

        groupItem.addEventListener("click", () => {
          currentGroupId = group.groupid;
          showView("groupChatContainer");
          fetchGroupMessages(currentGroupId, true); // Fetch group messages
          fetchGroupMembers(currentGroupId); // Fetch group members
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
      const userListContainer = document.createElement("div");
      userListContainer.id = "userListContainer";
      userListContainer.classList.add("user-list-container");
      document.body.appendChild(userListContainer);

      allUsers.forEach((user) => {
        const userItem = document.createElement("div");
        userItem.textContent = `User ID: ${user.userid}, Username: ${user.username}`;
        userItem.dataset.userid = user.userid;
        userItem.classList.add("user-item");
        userListContainer.appendChild(userItem);

        userItem.addEventListener("click", () => {
          const userId = user.userid;
          addUserToGroup(userId);
        });
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

        // Refresh group members list and update UI
        fetchGroupMembers(currentGroupId);
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

// Function to send group message to server
function sendGroupMessage(message) {
  const messageData = {
    user: username,
    message,
    timestamp: new Date().toISOString(),
  };
  if (currentGroupId) {
    socket.emit("group-message", { groupid: currentGroupId, messageData });
    displayGroupMessage(messageData, true); // Display own message immediately
  } else {
    console.error("No current group selected");
  }
}

// // Function to display group message in UI
// function displayGroupMessage(messageData, isSender) {
//   const groupMessages = document.getElementById("groupMessages");
//   const messageElement = createMessageElement(messageData, isSender);
//   groupMessages.appendChild(messageElement);
//   groupMessages.scrollTop = groupMessages.scrollHeight;
// }
// Function to display a group message
function displayGroupMessage(messageData, isSender) {
  const groupMessages = document.getElementById("groupMessages");
  const messageElement = createMessageElement(messageData, isSender);
  groupMessages.appendChild(messageElement);
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
        // groupMessages.scrollHeight - groupMessages.scrollHeight;
        (groupMessages.scrollTop = groupMessages.scrollHeight);

      messages.messages.forEach((message) => {
        const messageData = {
          user: message.sender,
          message: message.message,
          timestamp: new Date(message.created_at),
        };

        if (isInitialLoad) {
          displayGroupMessage(messageData, message.sender === username);
        } else {
          const messageElement = createMessageElement(
            messageData,
            message.sender === username
          );
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

// // Socket event to receive group messages
// socket.on("group-message", (messageData) => {
//   if (currentGroupId === messageData.groupid) {
//     displayGroupMessage(messageData, false); // Display received message in UI
//   }
// });
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
