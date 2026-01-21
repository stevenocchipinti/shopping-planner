import { initializeApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDo7qDDl-0MFj47DJmX0Y4vhPXX3KNM1kc",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "shopping-list-app-de905.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://shopping-list-app-de905.firebaseio.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "shopping-list-app-de905",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "shopping-list-app-de905.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "975596815491",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:975596815491:web:13f78f51887f0a546747b6",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Enable offline persistence (same as old app)
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === "failed-precondition") {
    console.warn("Persistence failed: Multiple tabs open")
  } else if (err.code === "unimplemented") {
    console.warn("Persistence not supported by browser")
  }
})
