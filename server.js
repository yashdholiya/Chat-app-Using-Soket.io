  const express = require("express");
  const http = require("http");
  const socketIo = require("socket.io");
  const bcrypt = require("bcrypt");
  const mysql = require("mysql");
  const admin = require("firebase-admin");

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

  // Initialize Firebase Admin SDK
  const serviceAccount = require("./firebase.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

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

  app.post("/login", (req, res) => {
    const { username, password, fcmToken } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";

    connection.query(query, [username], (error, results) => {
      if (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
      } else {
        if (results.length > 0) {
          const user = results[0];
          if (bcrypt.compareSync(password, user.password)) {
            const updateQuery = `
              UPDATE users SET status = 'online', fcm_token = ? WHERE userid = ?
            `;
            connection.query(
              updateQuery,
              [fcmToken, user.userid],
              (err, updateResult) => {
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
              }
            );
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

              // Fetch FCM token from the database
              const fcmTokenQuery =
                "SELECT fcm_token FROM users WHERE username = ?";
              connection.query(fcmTokenQuery, [to], (err, result) => {
                // console.log("token...",fcmTokenQuery);
                if (err) {
                  console.error("Error fetching FCM token:", err);
                } else if (result.length > 0) {
                  const fcmToken = result[0].fcm_token;
                  if (fcmToken) {
                    // Send notification via Firebase
                    const message = {
                      notification: {
                        title: `New message from ${messageData.user}`,
                        body: messageData.message,
                      },
                      token: fcmToken,
                    };
                    // console.log("..message ...fcToken..",message,fcmToken);

                    admin
                      .messaging()
                      .send(message)
                      .then((response) => {
                        console.log("Successfully sent message:", response);
                      })
                      .catch((error) => {
                        console.error("Error sending message:", error);
                      });
                  } else {
                    console.log("...fcmToken...", fcmToken);
                    console.error("FCM token is missing for user:", to);
                  }
                } else {
                  console.error("No FCM token found for user:", to);
                }
              });
            }
          }
        );
      }
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
