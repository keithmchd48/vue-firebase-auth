import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'

Vue.config.productionTip = false;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGjbHZ9KSsFpY7UNZWzryOY3Owxh-FRs0",
    authDomain: "vue-firebase-auth-b2c28.firebaseapp.com",
    databaseURL: "https://vue-firebase-auth-b2c28.firebaseio.com",
    projectId: "vue-firebase-auth-b2c28",
    storageBucket: "",
    messagingSenderId: "378390949187",
    appId: "1:378390949187:web:4ff89b14458ee011"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
// update firestore settings
// db.settings({ timestampsInSnapshots: true });
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
