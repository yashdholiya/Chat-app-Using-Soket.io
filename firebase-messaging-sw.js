import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9KxDiUTiTEa8a4Clz3qB9gCJKlw1ikd4",
  authDomain: "chat-app-23373.firebaseapp.com",
  projectId: "chat-app-23373",
  storageBucket: "chat-app-23373.appspot.com",
  messagingSenderId: "720635786190",
  appId: "1:720635786190:web:75d58acc418bb130b1f19f",
  measurementId: "G-BS5V5G8PZ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
