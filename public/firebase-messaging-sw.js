importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyA-imKQRa9rLrYbaRRgUiFM69Cj00tIExw",
  authDomain: "service-link-ca244.firebaseapp.com",
  projectId: "service-link-ca244",
  storageBucket: "service-link-ca244.firebasestorage.app",
  messagingSenderId: "273064596177",
  appId:  "1:273064596177:web:b6e9060bc01f45a150abf0",
});

const messaging = firebase.messaging();