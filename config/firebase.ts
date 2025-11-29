// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbulqlbR1kOaDYdEbq8MQxf9JmYIJKp9g",
  authDomain: "meu-kwanza-controlado.firebaseapp.com",
  projectId: "meu-kwanza-controlado",
  storageBucket: "meu-kwanza-controlado.firebasestorage.app",
  messagingSenderId: "824224677785",
  appId: "1:824224677785:web:cebbade34753febd139d08",
  measurementId: "G-FXERPWX063"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

// db
export const firestore = getFirestore(app)