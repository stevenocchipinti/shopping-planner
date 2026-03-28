import { getApp, getApps, initializeApp } from "firebase/app"
import {
  initializeFirestore,
  memoryLocalCache,
} from "firebase/firestore"
import { FirebaseApp } from "firebase/app"
import { Firestore } from "firebase/firestore"

interface FirebaseConfig {
  apiKey?: string
  authDomain?: string
  databaseURL?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

const fallbackConfig: FirebaseConfig = {
  apiKey: "AIzaSyCtgligqZSkUwWkWIAcMOW0nIW2mfgVdcw",
  authDomain: "shopping-list-app-de905.firebaseapp.com",
  databaseURL: "https://shopping-list-app-de905.firebaseio.com",
  projectId: "shopping-list-app-de905",
  messagingSenderId: "975596815491",
}

const firebaseConfig: FirebaseConfig = Object.fromEntries(
  Object.entries({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
    authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
    databaseURL:
      import.meta.env.VITE_FIREBASE_DATABASE_URL || fallbackConfig.databaseURL,
    projectId:
      import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      fallbackConfig.storageBucket,
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      fallbackConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  }).filter(([, value]) => Boolean(value))
) as FirebaseConfig

const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db: Firestore = initializeFirestore(app, {
  localCache: memoryLocalCache(),
})

export { app, db, firebaseConfig }
