import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Добавьте этот импорт

const firebaseConfig = {
  apiKey: "AIzaSyD7r-LR8KWgKrxHeR9mF00MQr0ELoPTIbM",
  authDomain: "leadai-7b0d9.firebaseapp.com",
  projectId: "leadai-7b0d9",
  storageBucket: "leadai-7b0d9.appspot.com",
  messagingSenderId: "581948504324",
  appId: "1:581948504324:web:fb42b1c2e81109ed08b851",
  measurementId: "G-TBSYZ03L8M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Инициализация хранилища Firebase
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { auth, db, storage, analytics }; // Экспорт хранилища Firebase
