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
///////////////////////////////////////////////////////////////////////////////////server /////////////////////////////////////////////////////
/*                                                                       this is chat real code                                                                      */
// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const bcrypt = require("bcrypt");
// const mysql = require("mysql");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "chat_app",
// });

// app.use(express.static(__dirname + "/public"));
// app.use(express.json());

// let onlineUsers = {};

// // User registration endpoint
// app.post("/register", (req, res) => {
//   const { userid, username, password } = req.body;
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   const query =
//     "INSERT INTO users (userid, username, password, status) VALUES (?, ?, ?, 'offline')";

//   connection.query(
//     query,
//     [userid, username, hashedPassword],
//     (error, results) => {
//       if (error) {
//         console.error("Error registering user:", error);
//         res.status(500).send("Error registering user");
//       } else {
//         res.send("User registered successfully");
//       }
//     }
//   );
// });

// // User login endpoint
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const query = "SELECT * FROM users WHERE username = ?";

//   connection.query(query, [username], (error, results) => {
//     if (error) {
//       console.error("Error logging in:", error);
//       ``;
//       res.status(500).send("Error logging in");
//     } else {
//       if (results.length > 0) {
//         const user = results[0];
//         if (bcrypt.compareSync(password, user.password)) {
//           const updateQuery =
//             "UPDATE users SET status = 'online' WHERE userid = ?";
//           connection.query(updateQuery, [user.userid], (err, updateResult) => {
//             if (err) {
//               console.error("Error updating user status:", err);
//               res.status(500).send("Error logging in");
//             } else {
//               res.send({
//                 message: "Login successful",
//                 userid: user.userid,
//                 username: user.username,
//               });
//             }
//           });
//         } else {
//           res.status(401).send("Invalid password");
//         }
//       } else {
//         res.status(401).send("User not found");
//       }
//     }
//   });
// });

// // Fetch all users
// app.get("/users", (req, res) => {
//   const query = "SELECT userid, username, status FROM users";
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).send("Error fetching users");
//     } else {
//       res.json(results);
//     }
//   });
// });

// // Socket.io handling
// io.on("connection", (socket) => {
//   // Handle join event
//   socket.on("joinRoom", ({ userId, username }) => {
//     onlineUsers[userId] = { socketId: socket.id, username };

//     // Broadcast updated user list
//     io.emit("update-users", Object.values(onlineUsers));

//     // Update user status to online in the database
//     const updateQuery = "UPDATE users SET status = 'online' WHERE userid = ?";
//     connection.query(updateQuery, [userId], (err, results) => {
//       if (err) {
//         console.error("Error updating user status:", err);
//       } else {
//         // Fetch updated user list and broadcast it
//         const query = "SELECT userid, username, status FROM users";
//         connection.query(query, (error, results) => {
//           if (error) {
//             console.error("Error fetching users:", error);
//           } else {
//             io.emit("update-users", results);
//           }
//         });
//       }
//     });
//   });

//   // Handle private message
//   socket.on("private-message", ({ to, messageData }) => {
//     const recipient = Object.values(onlineUsers).find(
//       (user) => user.username === to
//     );
//     if (recipient) {
//       console.log("messages...", messageData);

//       // Add a timestamp to the message data
//       messageData.timestamp = new Date().toISOString();

//       // Save message to the database with timestamp
//       const query =
//         "INSERT INTO messages (sender, recipient, message, created_at) VALUES (?, ?, ?, ?)";
//       connection.query(
//         query,
//         [messageData.user, to, messageData.message, messageData.timestamp],
//         (error, results) => {
//           if (error) {
//             console.error("Error saving message:", error);
//           } else {
//             io.to(recipient.socketId).emit("private-message", messageData);
//           }
//         }
//       );
//     }
//   });

//   // Handle disconnect event
//   socket.on("disconnect", () => {
//     let userId = null;
//     for (const id in onlineUsers) {
//       if (onlineUsers[id].socketId === socket.id) {
//         userId = id;

//         // Update last seen time and status in the database
//         const disconnectTime = new Date();
//         const updateQuery =
//           "UPDATE users SET status = 'offline', last_seen = ? WHERE userid = ?";
//         connection.query(
//           updateQuery,
//           [disconnectTime, userId],
//           (err, results) => {
//             if (err) {
//               console.error("Error updating user status:", err);
//             } else {
//               // Fetch updated user list and broadcast it
//               const query =
//                 "SELECT userid, username, status, last_seen FROM users";
//               connection.query(query, (error, results) => {
//                 if (error) {
//                   console.error("Error fetching users:", error);
//                 } else {
//                   io.emit("update-users", results);
//                 }
//               });
//             }
//           }
//         );

//         delete onlineUsers[id];
//         break;
//       }
//     }
//   });
// });

// // API endpoint to get messages between two users
// app.get("/messages", (req, res) => {
//   const { sender, recipient } = req.query;

//   const query =
//     "SELECT * FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY created_at ASC";

//   connection.query(
//     query,
//     [sender, recipient, recipient, sender],
//     (error, results) => {
//       if (error) {
//         console.error("Error fetching messages:", error);
//         res.status(500).send("Error fetching messages");
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });

// // Start server
// const PORT = 2123;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

/*                                                                       this is chat real code   update pagination                                                                    */

// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const bcrypt = require("bcrypt");
// const mysql = require("mysql");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "chat_app",
// });

// app.use(express.static(__dirname + "/public"));
// app.use(express.json());

// let onlineUsers = {};

// // User registration endpoint
// app.post("/register", (req, res) => {
//   const { userid, username, password } = req.body;
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   const query =
//     "INSERT INTO users (userid, username, password, status) VALUES (?, ?, ?, 'offline')";

//   connection.query(
//     query,
//     [userid, username, hashedPassword],
//     (error, results) => {
//       if (error) {
//         console.error("Error registering user:", error);
//         res.status(500).send("Error registering user");
//       } else {
//         res.send("User registered successfully");
//       }
//     }
//   );
// });

// // User login endpoint
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const query = "SELECT * FROM users WHERE username = ?";

//   connection.query(query, [username], (error, results) => {
//     if (error) {
//       console.error("Error logging in:", error);
//       res.status(500).send("Error logging in");
//     } else {
//       if (results.length > 0) {
//         const user = results[0];
//         if (bcrypt.compareSync(password, user.password)) {
//           const updateQuery =
//             "UPDATE users SET status = 'online' WHERE userid = ?";
//           connection.query(updateQuery, [user.userid], (err, updateResult) => {
//             if (err) {
//               console.error("Error updating user status:", err);
//               res.status(500).send("Error logging in");
//             } else {
//               res.send({
//                 message: "Login successful",
//                 userid: user.userid,
//                 username: user.username,
//               });
//             }
//           });
//         } else {
//           res.status(401).send("Invalid password");
//         }
//       } else {
//         res.status(401).send("User not found");
//       }
//     }
//   });
// });

// // Fetch all users
// app.get("/users", (req, res) => {
//   const query = "SELECT userid, username, status FROM users";
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).send("Error fetching users");
//     } else {
//       res.json(results);
//     }
//   });
// });

// // Socket.io handling
// io.on("connection", (socket) => {
//   // Handle join event
//   socket.on("joinRoom", ({ userId, username }) => {
//     onlineUsers[userId] = { socketId: socket.id, username };

//     // Broadcast updated user list
//     io.emit("update-users", Object.values(onlineUsers));

//     // Update user status to online in the database
//     const updateQuery = "UPDATE users SET status = 'online' WHERE userid = ?";
//     connection.query(updateQuery, [userId], (err, results) => {
//       if (err) {
//         console.error("Error updating user status:", err);
//       } else {
//         // Fetch updated user list and broadcast it
//         const query = "SELECT userid, username, status FROM users";
//         connection.query(query, (error, results) => {
//           if (error) {
//             console.error("Error fetching users:", error);
//           } else {
//             io.emit("update-users", results);
//           }
//         });
//       }
//     });
//   });

//   // Handle private message
//   socket.on("private-message", ({ to, messageData }) => {
//     const recipient = Object.values(onlineUsers).find(
//       (user) => user.username === to
//     );
//     if (recipient) {
//       // Add a timestamp to the message data
//       messageData.timestamp = new Date().toISOString();

//       // Save message to the database with timestamp
//       const query =
//         "INSERT INTO messages (sender, recipient, message, created_at) VALUES (?, ?, ?, ?)";
//       connection.query(
//         query,
//         [messageData.user, to, messageData.message, messageData.timestamp],
//         (error, results) => {
//           if (error) {
//             console.error("Error saving message:", error);
//           } else {
//             // Emit the message data along with timestamp to recipient
//             io.to(recipient.socketId).emit("private-message", messageData);
//           }
//         }
//       );
//     }
//   });

//   // Handle disconnect event
//   socket.on("disconnect", () => {
//     // Find the disconnected user by socketId
//     const disconnectedUser = Object.values(onlineUsers).find(
//       (user) => user.socketId === socket.id
//     );

//     if (disconnectedUser) {
//       const userId = Object.keys(onlineUsers).find(
//         (id) => onlineUsers[id].socketId === socket.id
//       );

//       // Update last seen time and status in the database
//       const disconnectTime = new Date();
//       const updateQuery =
//         "UPDATE users SET status = 'offline', last_seen = ? WHERE userid = ?";
//       connection.query(
//         updateQuery,
//         [disconnectTime, userId],
//         (err, results) => {
//           if (err) {
//             console.error("Error updating user status:", err);
//           } else {
//             // Fetch updated user list and broadcast it
//             const query =
//               "SELECT userid, username, status, last_seen FROM users";
//             connection.query(query, (error, results) => {
//               if (error) {
//                 console.error("Error fetching users:", error);
//               } else {
//                 io.emit("update-users", results);
//               }
//             });
//           }
//         }
//       );

//       // Remove the user from the onlineUsers object
//       delete onlineUsers[userId];
//     }
//   });
// });

// // API endpoint to get messages between two users with pagination
// app.get("/messages", (req, res) => {
//   const { sender, recipient, page = 1, limit = 10 } = req.query;
//   const offset = (page - 1) * limit;

//   // Query to get the total count of messages
//   const countQuery = `
//     SELECT COUNT(*) AS totalCount
//     FROM messages
//     WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
//   `;

//   // Query to get the messages with pagination
//   const messagesQuery = `
//     SELECT *
//     FROM messages
//     WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
//     ORDER BY created_at desc
//     LIMIT ? OFFSET ?
//   `;
//   // const messagesQuery = `
//   //     SELECT * FROM (
//   //       SELECT * FROM messages
//   //       WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
//   //       ORDER BY created_at DESC
//   //       LIMIT ? OFFSET ?
//   //     ) AS message_sub
//   //     ORDER BY created_at ASC
//   //   `;
//   // Execute the count query
//   connection.query(
//     countQuery,
//     [sender, recipient, recipient, sender],
//     (error, countResults) => {
//       if (error) {
//         console.error("Error fetching message count:", error);
//         res.status(500).send("Error fetching messages");
//         return;
//       }

//       const totalCount = countResults[0].totalCount;
//       // console.log("hello total count ", totalCount);

//       // Execute the messages query
//       connection.query(
//         messagesQuery,
//         [
//           sender,
//           recipient,
//           recipient,
//           sender,
//           parseInt(limit),
//           parseInt(offset),
//         ],
//         (error, messagesResults) => {
//           if (error) {
//             console.error("Error fetching messages:", error);
//             res.status(500).send("Error fetching messages");
//             return;
//           }
//           // console.log("hello .....", messagesResults);
//           // console.log("ofset......................", offset);

//           // Calculate the total pages
//           const totalPages = Math.ceil(totalCount / limit);
//           // console.log("page ...",totalPages);

//           res.json({
//             messages: messagesResults,
//             pagination: {
//               currentPage: parseInt(page),
//               totalPages: totalPages,
//               totalCount: totalCount,
//             },
//           });
//         }
//       );
//     }
//   );
// });

// // Start server
// const PORT = 2123;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

/*
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

app.use(express.static(__dirname + "/public"));
app.use(express.json());

let onlineUsers = {};

// User registration endpoint
app.post("/register", (req, res) => {
  const { userid, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO users (userid, username, password, status) VALUES (?, ?, ?, 'offline')";

  connection.query(
    query,
    [userid, username, hashedPassword],
    (error, results) => {
      if (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
      } else {
        res.send("User registered successfully");
      }
    }
  );
});

// User login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error("Error logging in:", error);
      res.status(500).send("Error logging in");
    } else {
      if (results.length > 0) {
        const user = results[0];
        if (bcrypt.compareSync(password, user.password)) {
          const updateQuery =
            "UPDATE users SET status = 'online' WHERE userid = ?";
          connection.query(updateQuery, [user.userid], (err, updateResult) => {
            if (err) {
              console.error("Error updating user status:", err);
              res.status(500).send("Error logging in");
            } else {
              res.send({
                message: "Login successful",
                userid: user.userid,
                username: user.username,
              });
            }
          });
        } else {
          res.status(401).send("Invalid password");
        }
      } else {
        res.status(401).send("User not found");
      }
    }
  });
});

// Fetch all users
app.get("/users", (req, res) => {
  const query = "SELECT userid, username, status FROM users";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Error fetching users");
    } else {
      res.json(results);
      console.log("....", results);
    }
  });
});

// Create group endpoint
app.post("/create-group", (req, res) => {
  const { groupname } = req.body;
  const query = "INSERT INTO groups (groupname) VALUES (?)";

  connection.query(query, [groupname], (error, results) => {
    if (error) {
      console.error("Error creating group:", error);
      res.status(500).send({ message: "Error creating group" });
    } else {
      const groupId = results.insertId;
      const newGroup = { groupid: groupId, groupname };
      io.emit("group-created", newGroup);
      res.send({ message: "Group created successfully" });
    }
  });
});

// Fetch all groups
app.get("/group-names", (req, res) => {
  const query = "SELECT groupid, groupname FROM groups";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching groups:", error);
      res.status(500).send({ message: "Error fetching groups" });
    } else {
      res.json(results);
    }
  });
});

// Add user to group endpoint
app.post("/add-to-group", (req, res) => {
  const { groupid, userid } = req.body;
  const query = "INSERT INTO group_members (groupid, userid) VALUES (?, ?)";

  connection.query(query, [groupid, userid], (error, results) => {
    if (error) {
      console.error("Error adding user to group:", error);
      res.status(500).send({ message: "Error adding user to group" });
    } else {
      res.send({ message: "User added to group successfully" });
    }
  });
});

app.get("/group-messages", (req, res) => {
  const { groupid, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const countQuery =
    "SELECT COUNT(*) AS totalCount FROM group_messages WHERE groupid = ?";
  const messagesQuery = `
    SELECT * FROM group_messages 
    WHERE groupid = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?`;

  connection.query(countQuery, [groupid], (error, countResults) => {
    if (error) {
      console.error("Error fetching group message count:", error);
      res.status(500).send({ message: "Error fetching group messages" });
      return;
    }

    const totalCount = countResults[0].totalCount;

    connection.query(
      messagesQuery,
      [groupid, parseInt(limit), parseInt(offset)],
      (error, messagesResults) => {
        if (error) {
          console.error("Error fetching group messages:", error);
          res.status(500).send({ message: "Error fetching group messages" });
          return;
        }

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
          messages: messagesResults,
          pagination: {
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalCount: totalCount,
          },
        });
      }
    );
  });
});
// Socket.io handling
io.on("connection", (socket) => {
  // Handle join event
  socket.on("joinRoom", ({ userId, username }) => {
    onlineUsers[userId] = { socketId: socket.id, username };

    // Broadcast updated user list
    io.emit("update-users", Object.values(onlineUsers));

    // Update user status to online in the database
    const updateQuery = "UPDATE users SET status = 'online' WHERE userid = ?";
    connection.query(updateQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error updating user status:", err);
      } else {
        // Fetch updated user list and broadcast it
        const query = "SELECT userid, username, status FROM users";
        connection.query(query, (error, results) => {
          if (error) {
            console.error("Error fetching users:", error);
          } else {
            io.emit("update-users", results);
          }
        });
      }
    });

    // Automatically join the user to the groups they are part of
    const groupsQuery = "SELECT groupid FROM group_members WHERE userid = ?";
    connection.query(groupsQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user groups:", err);
      } else {
        results.forEach((row) => {
          socket.join(`group_${row.groupid}`);
        });
      }
    });
  });

  // Handle private message
  socket.on("private-message", ({ to, messageData }) => {
    const recipient = Object.values(onlineUsers).find(
      (user) => user.username === to
    );
    if (recipient) {
      // Add a timestamp to the message data
      messageData.timestamp = new Date().toISOString();

      // Save message to the database with timestamp
      const query =
        "INSERT INTO messages (sender, recipient, message, created_at) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [messageData.user, to, messageData.message, messageData.timestamp],
        (error, results) => {
          if (error) {
            console.error("Error saving message:", error);
          } else {
            // Emit the message data along with timestamp to recipient
            io.to(recipient.socketId).emit("private-message", messageData);
          }
        }
      );
    }
  });

  // Handle group message
  socket.on("group-message", ({ groupid, messageData }) => {
    const query =
      "INSERT INTO group_messages (groupid, sender, message) VALUES (?, ?, ?)";
    connection.query(
      query,
      [groupid, messageData.user, messageData.message],
      (error, results) => {
        if (error) {
          console.error("Error saving group message:", error);
        } else {
          // Emit the message to all users in the group
          io.to(`group_${groupid}`).emit("group-message", {
            groupid,
            ...messageData,
          });
          console.log("Group message saved successfully");
        }
      }
    );
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    // Find the disconnected user by socketId
    const disconnectedUser = Object.values(onlineUsers).find(
      (user) => user.socketId === socket.id
    );

    if (disconnectedUser) {
      const userId = Object.keys(onlineUsers).find(
        (id) => onlineUsers[id].socketId === socket.id
      );

      // Update last seen time and status in the database
      const disconnectTime = new Date();
      const updateQuery =
        "UPDATE users SET status = 'offline', last_seen = ? WHERE userid = ?";
      connection.query(
        updateQuery,
        [disconnectTime, userId],
        (err, results) => {
          if (err) {
            console.error("Error updating user status:", err);
          } else {
            // Fetch updated user list and broadcast it
            const query =
              "SELECT userid, username, status, last_seen FROM users";
            connection.query(query, (error, results) => {
              if (error) {
                console.error("Error fetching users:", error);
              } else {
                io.emit("update-users", results);
              }
            });
          }
        }
      );

      // Remove the user from the onlineUsers object
      delete onlineUsers[userId];
    }
  });
});

// API endpoint to get messages between two users with pagination
app.get("/messages", (req, res) => {
  const { sender, recipient, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Query to get the total count of messages
  const countQuery = `
    SELECT COUNT(*) AS totalCount
    FROM messages
    WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) 
  `;

  // Query to get the messages with pagination
  const messagesQuery = `
    SELECT *
    FROM messages
    WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
    ORDER BY created_at desc
    LIMIT ? OFFSET ?
  `;
  // const messagesQuery = `
  //     SELECT * FROM (
  //       SELECT * FROM messages
  //       WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
  //       ORDER BY created_at DESC
  //       LIMIT ? OFFSET ?
  //     ) AS message_sub
  //     ORDER BY created_at ASC
  //   `;
  // Execute the count query
  connection.query(
    countQuery,
    [sender, recipient, recipient, sender],
    (error, countResults) => {
      if (error) {
        console.error("Error fetching message count:", error);
        res.status(500).send("Error fetching messages");
        return;
      }

      const totalCount = countResults[0].totalCount;
      // console.log("hello total count ", totalCount);

      // Execute the messages query
      connection.query(
        messagesQuery,
        [
          sender,
          recipient,
          recipient,
          sender,
          parseInt(limit),
          parseInt(offset),
        ],
        (error, messagesResults) => {
          if (error) {
            console.error("Error fetching messages:", error);
            res.status(500).send("Error fetching messages");
            return;
          }
          // console.log("hello .....", messagesResults);
          // console.log("ofset......................", offset);

          // Calculate the total pages
          const totalPages = Math.ceil(totalCount / limit);
          // console.log("page ...",totalPages);

          res.json({
            messages: messagesResults,
            pagination: {
              currentPage: parseInt(page),
              totalPages: totalPages,
              totalCount: totalCount,
            },
          });
        }
      );
    }
  );
});

// Start server
const PORT = 2123;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
*/
