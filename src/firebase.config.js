// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAW0fk-8kmZWM5ojCc2Us9pKCRoKHggBfc",
	authDomain: "simple-social-media-app-607a4.firebaseapp.com",
	projectId: "simple-social-media-app-607a4",
	storageBucket: "simple-social-media-app-607a4.appspot.com",
	messagingSenderId: "413782170232",
	appId: "1:413782170232:web:6236ee01e014baec70ab8d",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
