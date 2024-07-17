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
      res.json(results); console.log("grup name ...",results);
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
// Fetch group messages endpoint with pagination
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
          io.emit(`group-message-${groupid}`, messageData);
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
