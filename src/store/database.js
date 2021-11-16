import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

var config = {
    apiKey: 'AIzaSyB3Z-VB7-dR2fZewtqe7ysJQptlifou_Uw',
    authDomain: 'osp18-igoc.firebaseapp.com',
    databaseURL: 'https://osp18-igoc.firebaseio.com',
    projectId: 'osp18-igoc',
    storageBucket: 'osp18-igoc.appspot.com',
    messagingSenderId: '887357854453'
};

firebase.initializeApp(config);

const database = firebase.firestore();
database.settings({ timestampsInSnapshots: true });

export const authReference      = firebase.auth();
export const databaseReference  = database.collection('users');
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();