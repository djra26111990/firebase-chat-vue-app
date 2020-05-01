import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyDXQO8PdFichOWUaIoPVoUyCGm5wNOx0KA",
  authDomain: "vue-chat-firebase-app-project.firebaseapp.com",
  databaseURL: "https://vue-chat-firebase-app-project.firebaseio.com",
  projectId: "vue-chat-firebase-app-project",
  storageBucket: "vue-chat-firebase-app-project.appspot.com",
  messagingSenderId: "617468918000"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//initialize Cloud Firestore through Firebase
var db = firebase.firestore();

window.db = db;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
