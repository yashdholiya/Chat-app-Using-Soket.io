// Firebase configuration
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "private-chat-fa901",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "321165746688",
  appId: "your_app_id",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// Request permission and retrieve FCM token
function requestNotificationPermission() {
  messaging
    .requestPermission()
    .then(() => {
      console.log("Notification permission granted.");
      return messaging.getToken({
        vapidKey:
          "BJ7Rmr-ixx0e1uNyTzlI3RsyqaWqblxQMoyw5TUTedKrUIcS0xyWwcGN1Pr5U4Wkdc1BpGotXkaOKqCEQUi8cP0",
      });
    })
    .then((currentToken) => {
      if (currentToken) {
        // Save the FCM token to your server
        saveFcmToken(userId, currentToken);
      } else {
        console.warn("No registration token available.");
      }
    })
    .catch((err) => {
      console.error("Error retrieving token:", err);
      if (err.code === "messaging/permission-blocked") {
        alert(
          "Notifications have been blocked. Please enable notifications in your browser settings."
        );
      }
    });
}

// Save FCM token to server
function saveFcmToken(userId, token) {
  fetch("/save-fcm-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      token: token,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("FCM token saved:", data);
    })
    .catch((error) => {
      console.error("Error saving FCM token:", error);
    });
}

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

// Call requestNotificationPermission() after successful login
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
      requestNotificationPermission(); // Request permission and get token
      console.log("User ID:", userId);
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
document.getElementById("privateMessages").addEventListener("scroll", () => {
  const privateMessages = document.getElementById("privateMessages");
  if (privateMessages.scrollTop === 0) {
    privateMessagePage++;
    fetchPrivateMessages(currentRecipient);
  }
});

// Initialize view
showView("registerContainer");


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
//   // Handle private message
//   // socket.on("private-message", ({ to, messageData }) => {
//   //   const recipient = Object.values(onlineUsers).find(
//   //     (user) => user.username === to
//   //   );
//   //   if (recipient) {
//   //     console.log("messages...", messageData);

//   //     // Add a timestamp to the message data
//   //     messageData.timestamp = new Date().toISOString();

//   //     // Save message to the database with timestamp
//   //     const query =
//   //       "INSERT INTO messages (sender, recipient, message, created_at) VALUES (?, ?, ?, ?)";
//   //     connection.query(
//   //       query,
//   //       [messageData.user, to, messageData.message, messageData.timestamp],
//   //       (error, results) => {
//   //         if (error) {
//   //           console.error("Error saving message:", error);
//   //         } else {
//   //           io.to(recipient.socketId).emit("private-message", messageData);

//   //           // Send FCM notification
//   //           const fcmTokenQuery =
//   //             "SELECT fcm_token FROM users WHERE username = ?";
//   //           connection.query(fcmTokenQuery, [to], (err, fcmTokenResults) => {
//   //             if (err) {
//   //               console.error("Error fetching FCM token:", err);
//   //             } else {
//   //               const fcmToken = fcmTokenResults[0].fcm_token;
//   //               if (fcmToken) {
//   //                 const message = {
//   //                   notification: {
//   //                     title: `New message from ${messageData.user}`,
//   //                     body: messageData.message,
//   //                   },
//   //                   token: fcmToken,
//   //                 };

//   //                 admin
//   //                   .messaging()
//   //                   .send(message)
//   //                   .then((response) => {
//   //                     console.log("Notification sent successfully:", response);
//   //                   })
//   //                   .catch((error) => {
//   //                     console.error("Error sending notification:", error);
//   //                   });
//   //               }
//   //             }
//   //           });
//   //         }
//   //       }
//   //     );
//   //   }
//   // });

//   // Handle disconnect event
//   socket.on("disconnect", () => {
//     const userId = Object.keys(onlineUsers).find(
//       (id) => onlineUsers[id].socketId === socket.id
//     );
//     if (userId) {
//       delete onlineUsers[userId];
//       // Update user status to offline in the database
//       const updateQuery =
//         "UPDATE users SET status = 'offline' WHERE userid = ?";
//       connection.query(updateQuery, [userId], (err, results) => {
//         if (err) {
//           console.error("Error updating user status:", err);
//         } else {
//           // Fetch updated user list and broadcast it
//           const query = "SELECT userid, username, status FROM users";
//           connection.query(query, (error, results) => {
//             if (error) {
//               console.error("Error fetching users:", error);
//             } else {
//               io.emit("update-users", results);
//             }
//           });
//         }
//       });
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
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    require("./firebasetken.json")
  ), // Ensure you have this file
});

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

let onlineUsers = {};

// User registration endpoint
app.post("/register", (req, res) => {
  const { userid, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO users (userid, username, password, status) VALUES (?, ?, ?, 'offline')";

  connection.query(query, [userid, username, hashedPassword], (error) => {
    if (error) {
      console.error("Error registering user:", error);
      res.status(500).send("Error registering user");
    } else {
      res.send("User registered successfully");
    }
  });
});

// User login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error("Error logging in:", error);
      res.status(500).send("Error logging in");
    } else if (results.length > 0) {
      const user = results[0];
      if (bcrypt.compareSync(password, user.password)) {
        const updateQuery =
          "UPDATE users SET status = 'online' WHERE userid = ?";
        connection.query(updateQuery, [user.userid], (err) => {
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

// Endpoint to save FCM token
app.post("/save-fcm-token", (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).send("User ID and token are required");
  }

  // Update FCM token in the database
  const query = "UPDATE users SET fcm_token = ? WHERE userid = ?";
  connection.query(query, [token, userId], (error) => {
    if (error) {
      console.error("Error saving FCM token:", error);
      res.status(500).send("Error saving FCM token");
    } else {
      res.send("FCM token saved successfully");
    }
  });
});

// Socket.io handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle join event
  socket.on("joinRoom", ({ userId, username }) => {
    onlineUsers[userId] = { socketId: socket.id, username };

    // Broadcast updated user list
    io.emit("update-users", Object.values(onlineUsers));

    // Update user status to online in the database
    const updateQuery = "UPDATE users SET status = 'online' WHERE userid = ?";
    connection.query(updateQuery, [userId], (err) => {
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
      // Add a timestamp to the message data
      messageData.timestamp = new Date().toISOString();

      // Save message to the database with timestamp
      const query =
        "INSERT INTO messages (sender, recipient, message, created_at) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [messageData.user, to, messageData.message, messageData.timestamp],
        (error) => {
          if (error) {
            console.error("Error saving message:", error);
          } else {
            io.to(recipient.socketId).emit("private-message", messageData);

            // Send FCM notification if the token is available
            const getTokenQuery =
              "SELECT fcm_token FROM users WHERE userid = ?";
            connection.query(
              getTokenQuery,
              [recipient.userid],
              (err, results) => {
                if (err) {
                  console.error("Error fetching FCM token:", err);
                } else if (results.length > 0 && results[0].fcm_token) {
                  const payload = {
                    notification: {
                      title: `New message from ${messageData.user}`,
                      body: messageData.message,
                    },
                  };

                  admin
                    .messaging()
                    .sendToDevice(results[0].fcm_token, payload)
                    .then((response) => {
                      console.log("Successfully sent message:", response);
                    })
                    .catch((error) => {
                      console.error("Error sending message:", error);
                    });
                }
              }
            );
          }
        }
      );
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");

    const userId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id].socketId === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];
      // Update user status to offline in the database
      const updateQuery =
        "UPDATE users SET status = 'offline' WHERE userid = ?";
      connection.query(updateQuery, [userId], (err) => {
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

          // Calculate the total pages
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
    }
  );
});

// Start server
const PORT = 2123;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
