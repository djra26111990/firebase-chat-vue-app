<template>
<div class="maindiv">
  <v-container fluid>
    <div class="div-translucido" id="container" style="max-height: 410px; overflow-y: auto">
      <div v-for="message in messages" v-bind:key="message.id">
        <template v-if="message.author === authUser.displayName">
          <v-chip class="ma-2" label color="#90CAF9">
            {{ message.message }} / {{ message.createdAt }}
          </v-chip>
          <span>{{ message.author }}</span>
          <v-spacer></v-spacer>
        </template>
        <template v-else>
          <v-chip class="ma-2" label color="white">
            {{ message.message }} / {{ message.createdAt }}
          </v-chip>
          <span>{{ message.author }}</span>
          <v-spacer></v-spacer>
        </template>
      </div>
    </div>
  <v-spacer></v-spacer>
    <div>
      <v-row>
        <v-col
        cols="12"
        sm="6"
        >
          <v-text-field
          placeholder="message" 
          background-color="white"
          rounded
          @keyup.enter="saveMessage" 
          v-model="message"
          />
            </v-col>
            <v-col
            cols="12"
            sm="6"
            >
            <v-btn @click="saveMessage"
            fab
            >
            <v-icon>
              mdi-comment-text-outline
            </v-icon>
            </v-btn>
            </v-col>
            </v-row>
            </div>
        </v-container>
</div>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'

export default {
  name: 'PrivateChat',
  data () {
    return {
      message: null,
      messages: [],
      authUser: {},
      router: null
    }
  },
  methods: {
    scrollToBottom() {
       let chatBox = document.querySelector('#container')
       chatBox.scrollTop = chatBox.scrollHeight
    },
    logout() {
    firebase.auth().signOut().then(() => {
    }).catch((error) => {
    console.log(error)
    });
    },
    saveMessage() {
      //save to firestore
      db.collection('chat').add({
        message: this.message,
        author: this.authUser.displayName,
        createdAt: moment().format('MMMM Do YYYY, HH:mm:ss')
      })
      .then((docRef) => {
         console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
         console.error("Error adding document: ", error);
      });
      //clean the input msg field
      this.message = null
      //scrolling down to bottom at send msg
      this.scrollToBottom()
    },
    fetchMessages() {
      db.collection('chat').orderBy('createdAt').onSnapshot((querySnapshot) => {
        let allMessages = [];
    querySnapshot.forEach((doc) => {
        allMessages.push(doc.data())
    });
    this.messages = allMessages;
    setTimeout(() => {
      this.scrollToBottom();
    },1000)
});
    }
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.authUser = user;
      } else {
        this.authUser = {}
      }
    })
    this.fetchMessages()
    this.scrollToBottom()
  },
  updated () {
    this.scrollToBottom()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          next()
        } else {
          vm.$router.push('/')
        }
      })
    })
  }
}
</script>

<style>
.maindiv {
  background: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  width: 100%;
}

.div-translucido {
  background-color: rgba(0, 0, 0, 0);
    color:#000;
}
</style>
