// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAvxBwP1neOdYlTk-Vir_pHCoFdR_j2pOo",
    authDomain: "campuseats-89040.firebaseapp.com",
    projectId: "campuseats-89040",
    storageBucket: "campuseats-89040.appspot.com",
    messagingSenderId: "995291554055",
    appId: "1:995291554055:web:a480cebadb149fa66fa5a2",
    measurementId: "G-GTW4L5Q30G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);