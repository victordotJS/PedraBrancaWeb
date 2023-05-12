import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD1WIfyThIPi2mqcmxWwm5ov3XhHXRCn1I",
  authDomain: "pedrabranca-ad2a5.firebaseapp.com",
  projectId: "pedrabranca-ad2a5",
  storageBucket: "pedrabranca-ad2a5.appspot.com",
  messagingSenderId: "590564687386",
  appId: "1:590564687386:web:0d48045aeddc31fb801ba3",
  measurementId: "G-3X3GQDL6EE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);