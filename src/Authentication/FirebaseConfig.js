import firebase from 'firebase/app';
import 'firebase/auth';
import './FirebaseKeys.js';
import FirebaseKeys from './FirebaseKeys.js';

const app = firebase.initializeApp(FirebaseKeys())

export const auth = app.auth()
export default app