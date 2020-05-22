import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'

require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyDXQO8PdFichOWUaIoPVoUyCGm5wNOx0KA",
  authDomain: "vue-chat-firebase-app-project.firebaseapp.com",
  databaseURL: "https://vue-chat-firebase-app-project.firebaseio.com",
  projectId: "vue-chat-firebase-app-project",
  storageBucket: "vue-chat-firebase-app-project.appspot.com",
  messagingSenderId: "617468918000",
  appId: "1:617468918000:web:95fde8030c7bd1deb32a35",
  measurementId: "G-MRM8HDMTY4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//initialize Cloud Firestore through Firebase
var db = firebase.firestore();

const messaging = firebase.messaging();

messaging.usePublicVapidKey("BGfKY6aw4TVRD_m1FmMSjW_06PMGEKNqZU_nxegwDqMUmSzdfPRCXKvz1ROMa7SRCaYjZukMGY1ywhjIlcJtrU4"); // 1. Generate a new key pair

// Request Permission of Notifications
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.');

  // Get Token
  messaging.getToken().then((token) => {
    console.log(token)
  })
}).catch((err) => {
  console.log('Unable to get permission to notify.', err);
});

window.db = db;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
