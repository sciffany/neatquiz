"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDPvEhn5mtDYmMQzXhlOPSlBjtExifZDck",
    authDomain: "neatquiz.firebaseapp.com",
    projectId: "neatquiz",
    storageBucket: "neatquiz.appspot.com",
    messagingSenderId: "76902212092",
    appId: "1:76902212092:web:68b1477819bd48a70dd279",
    measurementId: "G-29S2K3E2V4",
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
