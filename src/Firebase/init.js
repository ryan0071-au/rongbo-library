// src/firebase/init.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBj88tGLQQ0mrIxWN-Gn7YR5aqUZy-spsE',
  authDomain: 'week7-rongbo.firebaseapp.com',
  projectId: 'week7-rongbo',
  storageBucket: 'week7-rongbo.firebasestorage.app',
  messagingSenderId: '875240543678',
  appId: '1:875240543678:web:b98371caac4cb24432d5ef',
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)

// 导出 Firestore 和 Auth
export const db = getFirestore(app)
export const auth = getAuth(app)
