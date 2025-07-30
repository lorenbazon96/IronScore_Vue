import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqMmkRcALa52qovU6NIg_C0dU9hx4AJfM",
  authDomain: "ironscore-80b8b.firebaseapp.com",
  projectId: "ironscore-80b8b",
  storageBucket: "ironscore-80b8b.appspot.com",
  messagingSenderId: "1095989596443",
  appId: "1:1095989596443:web:968ea614fa66b02667c3be",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
