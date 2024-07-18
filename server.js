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

app.post("/create-group", (req, res) => {
  const { groupname } = req.body;
  const query = "INSERT INTO groups (groupname) VALUES (?)";

  connection.query(query, [groupname], (error, results) => {
    if (error) {
      console.error("Error creating group:", error);
      res.status(500).send("Error creating group");
    } else {
      res.send("Group created successfully");
    }
  });
});

// Fetch all groups
app.get("/group-names", (req, res) => {
  const query = "SELECT * FROM groups";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching group names:", error);
      res.status(500).json([]);
    } else {
      res.json(results);
    }
  });
});

// Handle adding user to group
app.post("/add-to-group", (req, res) => {
  const { groupid, userid } = req.body;
  const query = "INSERT INTO group_members (groupid, userid) VALUES (?, ?)";

  connection.query(query, [groupid, userid], (error, results) => {
    if (error) {
      console.error("Error adding user to group:", error);
      res.status(500).send("Error adding user to group");
    } else {
      res.send("User added to group successfully");
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

// Fetch group members
app.get("/group-members", (req, res) => {
  const { groupid } = req.query;
  const query =
    "SELECT users.userid, users.username FROM group_members INNER JOIN users ON group_members.userid = users.userid WHERE groupid = ?";

  connection.query(query, [groupid], (error, results) => {
    if (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json([]);
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
  // Handle group message
  // socket.on("group-message", ({ groupid, messageData }) => {
  //   const query = `
  //     SELECT COUNT(*) AS memberCount
  //     FROM group_members
  //     WHERE groupid = ? AND userid = ?
  //   `;
  //   connection.query(query, [groupid, messageData.user], (error, results) => {
  //     if (error) {
  //       console.error("Error checking group membership:", error);
  //       return;
  //     }
  //     const memberCount = results[0].memberCount;
  //     if (memberCount > 0) {
  //       const insertQuery = `
  //         INSERT INTO group_messages (groupid, sender, message)
  //         VALUES (?, ?, ?)
  //       `;
  //       connection.query(
  //         insertQuery,
  //         [groupid, messageData.user, messageData.message],
  //         (error, insertResult) => {
  //           if (error) {
  //             console.error("Error saving group message:", error);
  //           } else {
  //             // Emit the message to all users in the group
  //             io.to(`group_${groupid}`).emit("group-message", {
  //               groupid,
  //               ...messageData,
  //             });
  //           }
  //         }
  //       );
  //     } else {
  //       console.log(`User ${messageData.user} is not a member of group ${groupid}`);
  //     }
  //   });
  // });

  // Handle group message
  socket.on("group-message", ({ groupid, messageData }) => {
    const { user, message } = messageData;
    const query =
      "INSERT INTO group_messages (groupid, sender, message) VALUES (?, ?, ?)";
    connection.query(
      query,
      [groupid, user.userid, message],
      (error, results) => {
        if (error) {
          console.error("Error saving group message:", error);
        } else {
          // Fetch the sender's username
          const senderQuery = "SELECT username FROM users WHERE userid = ?";
          connection.query(senderQuery, [user.userid], (err, senderResult) => {
            if (err) {
              console.error("Error fetching sender username:", err);
            } else {
              const senderUsername = senderResult[0]?.username || "Unknown"; // Handle case where username is not found
              // Emit the message to all users in the group
              io.to(`group_${groupid}`).emit("group-message", {
                groupid,
                sender: { userid: user.userid, username: senderUsername },
                message,
                timestamp: new Date().toISOString(),
              });
            }
          });
        }
      }
    );
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id].socketId === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];
      // Update user status to offline in the database
      const updateQuery =
        "UPDATE users SET status = 'offline' WHERE userid = ?";
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
