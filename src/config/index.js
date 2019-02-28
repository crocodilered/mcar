import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: 'AIzaSyD1vc9oFhhvO_CU-w5dt88QdAGt-czqs78',
  authDomain: 'm-ycar.firebaseapp.com',
  databaseURL: 'https://m-ycar.firebaseio.com',
  projectId: 'm-ycar',
  storageBucket: 'm-ycar.appspot.com',
  messagingSenderId: '579779117888'
})

export const firestore = firebase.firestore()
export const auth = firebase.auth()
export const authPersistence = firebase.auth.Auth.Persistence
export const storage = firebase.storage()

export const devUserAccount = {
  validEmail: 'serge.zolotukhn@gmail.com',
  invalidEmail: 'serge.zolotukhn@gmail.ru',
  password: '123qweQWE'
}
