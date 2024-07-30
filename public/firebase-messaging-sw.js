// // firebase-messaging-sw.js
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyA9KxDiUTiTEa8a4Clz3qB9gCJKlw1ikd4",
//   authDomain: "chat-app-23373.firebaseapp.com",
//   projectId: "chat-app-23373",
//   storageBucket: "chat-app-23373.appspot.com",
//   messagingSenderId: "720635786190",
//   appId: "1:720635786190:web:75d58acc418bb130b1f19f",
//   measurementId: "G-BS5V5G8PZ1",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message ", payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: ayload.notification.icon,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyA9KxDiUTiTEa8a4Clz3qB9gCJKlw1ikd4",
  authDomain: "chat-app-23373.firebaseapp.com",
  projectId: "chat-app-23373",
  storageBucket: "chat-app-23373.appspot.com",
  messagingSenderId: "720635786190",
  appId: "1:720635786190:web:75d58acc418bb130b1f19f",
  measurementId: "G-BS5V5G8PZ1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
