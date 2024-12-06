import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug environment variables
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '[SET]' : '[NOT SET]',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '[SET]' : '[NOT SET]',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '[SET]' : '[NOT SET]',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '[SET]' : '[NOT SET]',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '[SET]' : '[NOT SET]',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? '[SET]' : '[NOT SET]'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);