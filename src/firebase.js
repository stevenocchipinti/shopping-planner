import { getApp, getApps, initializeApp } from "firebase/app"
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore"

const fallbackConfig = {
  apiKey: "AIzaSyCtgligqZSkUwWkWIAcMOW0nIW2mfgVdcw",
  authDomain: "shopping-list-app-de905.firebaseapp.com",
  databaseURL: "https://shopping-list-app-de905.firebaseio.com",
  projectId: "shopping-list-app-de905",
  messagingSenderId: "975596815491",
}

const firebaseConfig = Object.fromEntries(
  Object.entries({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
    authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
    databaseURL:
      import.meta.env.VITE_FIREBASE_DATABASE_URL || fallbackConfig.databaseURL,
    projectId:
      import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      fallbackConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  }).filter(([, value]) => Boolean(value))
)

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

enableIndexedDbPersistence(db).catch(error => {
  if (
    error.code !== "failed-precondition" &&
    error.code !== "unimplemented"
  ) {
    console.warn("Failed to enable Firestore persistence", error)
  }
})

export { app, db, firebaseConfig }
