import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD7r-LR8KWgKrxHeR9mF00MQr0ELoPTIbM",
  authDomain: "leadai-7b0d9.firebaseapp.com",
  databaseurl: "https://leadai-7b0d9-default-rtdb.firebaseio.com/",
  projectId: "leadai-7b0d9",
  storageBucket: "leadai-7b0d9.appspot.com",
  messagingSenderId: "581948504324",
  appId: "1:581948504324:web:fb42b1c2e81109ed08b851",
  measurementId: "G-TBSYZ03L8M"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };