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

// // // API endpoint to get messages between two users
// // app.get("/messages", (req, res) => {
// //   const { sender, recipient } = req.query;

// //   const query =
// //     "SELECT * FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY created_at ASC";

// //   connection.query(
// //     query,
// //     [sender, recipient, recipient, sender],
// //     (error, results) => {
// //       if (error) {
// //         console.error("Error fetching messages:", error);
// //         res.status(500).send("Error fetching messages");
// //       } else {
// //         res.json(results);
// //       }
// //     }
// //   );
// // });
// // API endpoint to get paginated messages between two users
// app.get("/messages", (req, res) => {
//   const { sender, recipient, page = 1, limit = 10 } = req.query;
//   const offset = (page - 1) * limit;

//   const query = `
//     SELECT * FROM messages
//     WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
//     ORDER BY created_at ASC
//     LIMIT ? OFFSET ?
//   `;

//   connection.query(
//     query,
//     [sender, recipient, recipient, sender, parseInt(limit), parseInt(offset)],
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

// // // Start server
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

// // API endpoint to get paginated messages between two users
// app.get("/messages", (req, res) => {
//   const { sender, recipient, page = 1, limit = 10 } = req.query;
//   const offset = (page - 1) * limit;

//   const query = `
//     SELECT * FROM messages
//     WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
//     ORDER BY created_at desc
//     LIMIT ? OFFSET ?
//   `;

//   connection.query(
//     query,
//     [sender, recipient, recipient, sender, parseInt(limit), parseInt(offset)],
//     (error, results) => {
//       if (error) {
//         console.error("Error fetching messages:", error);
//         res.status(500).send("Error fetching messages");
//       } else {
//         res.json(results);

//         // console.log("hello ..", results);
//       }
//     }
//   );
// });

// // Start server
// const PORT = 2123;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

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
      ``;
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
    }
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
  });

  // Handle private message
  socket.on("private-message", ({ to, messageData }) => {
    const recipient = Object.values(onlineUsers).find(
      (user) => user.username === to
    );
    if (recipient) {
      console.log("messages...", messageData);

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
            io.to(recipient.socketId).emit("private-message", messageData);
          }
        }
      );
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    let userId = null;
    for (const id in onlineUsers) {
      if (onlineUsers[id].socketId === socket.id) {
        userId = id;

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

        delete onlineUsers[id];
        break;
      }
    }
  });
});

// API endpoint to get paginated messages between two users
app.get("/messages", (req, res) => {
  const { sender, recipient, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM messages
    WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
    ORDER BY created_at desc
    LIMIT ? OFFSET ?
  `;

  connection.query(
    query,
    [sender, recipient, recipient, sender, parseInt(limit), parseInt(offset)],
    (error, results) => {
      if (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("Error fetching messages");
      } else {
        res.json(results);

        // console.log("hello ..", results);
      }
    }
  );
});

// Start server
const PORT = 2123;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// // function displayPrivateMessage(messageData, isSender) {
// //   const privateMessages = document.getElementById("privateMessages");
// //   const messageElement = document.createElement("div");
// //   messageElement.className = `message ${isSender ? "sent" : "received"}`;
// //   const timestamp = new Date(messageData.timestamp).toLocaleTimeString();
// //   messageElement.innerHTML = `
// //     <div class="message-user">${messageData.user}</div>
// //     <div class="message-content">${messageData.message}</div>
// //     <div class="message-timestamp">${timestamp}</div>
// //   `;

// //   // privateMessages.appendChild(messageElement);
// //   privateMessages.prepend(messageElement);
// //   privateMessages.scrollTop = privateMessages.scrollHeight;
// // }

// // Function to display private messages in the UI
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

// // Function to fetch and display private messages
// function fetchPrivateMessages(recipient) {
//   showLoader();
//   fetch(
//     `/messages?sender=${username}&recipient=${recipient}&page=${currentPage}&limit=${limit}`
//   )
//     .then((response) => response.json())
//     .then((messages) => {
//       if (messages.length > 0) {
//         messages.forEach((message) => {
//           const messageData = {
//             user: message.sender,
//             message: message.message,
//             timestamp: new Date(message.created_at).toISOString(),
//           };
//           displayPrivateMessage(messageData, message.sender === username);
//         });
//         currentPage++;
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
// // Event listener for scrolling in private messages
// document.getElementById("privateMessages").addEventListener("scroll", () => {
//   const { scrollTop, clientHeight } =
//     document.getElementById("privateMessages");
//   if (scrollTop === 0 && currentRecipient) {
//     fetchPrivateMessages(currentRecipient);
//   }
// });
// // // Initial setup: Show registration/login view
// showView("registerContainer");

const socket = io();
let userId = "";
let username = "";
let currentRecipient = null;
let currentPage = 1;
const limit = 10;

function showView(viewId) {
  hideAllViews();
  const viewElement = document.getElementById(viewId);
  if (viewElement) {
    viewElement.style.display = "block";
  } else {
    console.error(`Element with ID ${viewId} not found.`);
  }
}

function hideAllViews() {
  document.getElementById("registerContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("chatContainer").style.display = "none";
  document.getElementById("privateChatContainer").style.display = "none";
}

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

document.getElementById("backToChatBtn").addEventListener("click", () => {
  showView("chatContainer");
  currentRecipient = null;
  document.getElementById("privateMessages").innerHTML = "";
  currentPage = 1;
});

function sendPrivateMessage(to, message) {
  const messageData = {
    user: username,
    message,
    timestamp: new Date().toISOString(),
  };
  socket.emit("private-message", { to, messageData });
  displayPrivateMessage(messageData, true);
}

// Function to display private messages in the UI
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
  privateMessages.prepend(messageElement);
  privateMessages.scrollTop = privateMessages.scrollHeight;
}

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
        currentPage = 1;
        document.getElementById("privateMessages").innerHTML = "";
        fetchPrivateMessages(user.username);

        +showView("privateChatContainer");
      }
    });
    onlineUsersList.appendChild(userElement);
  });
});

// Function to fetch and display private messages
function fetchPrivateMessages(recipient) {
  showLoader();
  fetch(
    `/messages?sender=${username}&recipient=${recipient}&page=${currentPage}&limit=${limit}`
  )
    .then((response) => response.json())
    .then((messages) => {
      if (messages.length > 0) {
        messages.forEach((message) => {
          const messageData = {
            user: message.sender,
            message: message.message,
            timestamp: new Date(message.created_at).toISOString(),
          };
          displayPrivateMessage(messageData, message.sender === username);
        });
        currentPage++;
      }
      hideLoader();
    })
    .catch((error) => {
      console.error("Error fetching private messages:", error);
      hideLoader();
    });
}

function showLoader() {
  document.querySelector(".loader").classList.add("show");
}

function hideLoader() {
  document.querySelector(".loader").classList.remove("show");
}

socket.on("private-message", (messageData) => {
  if (currentRecipient === messageData.user || username === messageData.user) {
    displayPrivateMessage(messageData, false);
  }
});
// Event listener for scrolling in private messages
document.getElementById("privateMessages").addEventListener("scroll", () => {
  const { scrollTop, clientHeight } =
    document.getElementById("privateMessages");
  if (scrollTop === 0 && currentRecipient) {
    fetchPrivateMessages(currentRecipient);
  }
});
// // Initial setup: Show registration/login view
showView("registerContainer");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// body {
//     font-family: Arial, sans-serif;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100vh;
//     margin: 0;
//   }

//   #registerContainer,
//   #loginContainer,
//   #chatContainer,
//   #privateChatContainer {
//     display: none;
//     max-width: 600px;
//     width: 100%;
//     padding: 20px;
//     border: 1px solid #ccc;
//     border-radius: 8px;
//     background-color: #f9f9f9;
//     margin: 20px;
//   }

//   #registerContainer h2,
//   #loginContainer h2,
//   #chatContainer h2,
//   #privateChatContainer h2 {
//     text-align: center;
//   }

//   #registerForm,
//   #loginForm {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }

//   input[type="text"],
//   input[type="password"],
//   button {
//     margin: 10px;
//     padding: 10px;
//     width: 100%;
//     max-width: 300px;
//   }

//   button {
//     background-color: #4caf50;
//     color: white;
//     border: none;
//     cursor: pointer;
//   }

//   #privateChatContainer {
//     margin-top: 50px;
//   }

//   button:hover {
//     background-color: #45a049;
//   }

//   #onlineUsersList {
//     list-style-type: none;
//     padding: 0;
//   }

//   #onlineUsersList li {
//     padding: 8px;
//     cursor: pointer;
//     background-color: #ddd;
//     margin-bottom: 5px;
//   }

//   #onlineUsersList li:hover {
//     background-color: #ccc;
//   }

//   .message {
//     border: 1px solid #ccc;
//     padding: 10px;
//     margin: 5px;
//     border-radius: 8px;
//   }

//   .message-user {
//     font-weight: bold;
//   }

//   .sent {
//     align-self: flex-end;
//     background-color: #f0f0f0;
//   }

//   .received {
//     align-self: flex-start;
//     background-color: #e5e5e5;
//   }

//   .message-timestamp {
//     font-size: 0.8em;
//     color: #666;
//     margin-top: 5px;
//   }

//   #privateMessages .sent {
//     text-align: right;
//   }

//   #privateMessages .received {
//     text-align: left;
//   }

//   #privateMessages {
//     height: 600px;
//     overflow: auto;
//   }

//   .container {
//     display: none;
//   }

//   .user-item {
//     cursor: pointer;
//   }

//   #privateMessagesList {
//     max-height: 400px;
//     overflow-y: auto;
//     border: 1px solid #ccc;
//     padding: 10px;
//     list-style-type: none;
//   }

//   #privateMessagesList li {
//     margin-bottom: 10px;
//   }

//   .loader {
//     display: none;
//     text-align: center;
//   }
//   .loader.show {
//     display: block;
//   }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// <!--                                                                                    this is chat real code                                                                       -->

// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Chat App</title>
//   <link rel="stylesheet" href="style.css">
// </head>

// <body>
//   <div id="registerContainer">
//     <h2>Register</h2>
//     <form id="registerForm">
//       <input type="text" id="regUserId" placeholder="User ID" required><br>
//       <input type="text" id="regUsername" placeholder="Username" required><br>
//       <input type="password" id="regPassword" placeholder="Password" required><br>
//       <button type="submit">Register</button>
//       <button onclick="showView('loginContainer')">Go to Login</button>

//     </form>
//   </div>

//   <div id="loginContainer">
//     <h2>Login</h2>
//     <form id="loginForm">
//       <input type="text" id="loginUsername" placeholder="Username" required><br>
//       <input type="password" id="loginPassword" placeholder="Password" required><br>
//       <button type="submit">Login</button>
//     </form>
//   </div>

//   <div id="chatContainer">
//     <h2>Welcome, <span id="currentUser"></span></h2>
//     <h3>Online Users</h3>
//     <ul id="onlineUsersList"></ul>
//   </div>

//   <div id="privateChatContainer">
//     <h2 id="privateChatWith"></h2>
//     <!-- <div id="privateMessages"></div> -->
//     <div id="privateMessages" style="height: 300px; overflow-y: scroll;"></div>
//     <form id="privateMessageForm">
//       <input type="text" id="privateMessageInput" placeholder="Type a message..." required>
//       <button type="submit">Send</button>
//       <!-- <div id="loader" class="loader">Loading...</div> -->

//     </form>
//     <div class="loader">Loading...</div>
//     <button id="backToChatBtn">Back to Chat</button>
//   </div>

//   <script src="/socket.io/socket.io.js"></script>
//   <script src="script.js"></script>
// </body>

// </html>
