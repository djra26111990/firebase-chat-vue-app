<template>
<div>
  <v-container fluid>
    <div id="container" style="max-height: 410px; overflow-y: auto">
      <v-list height="90" flat class="overflow-y-auto" v-for="message in messages" v-bind:key="message.id">
        <template v-if="message.author === authUser.displayName">
          <v-chip class="ma-2" label color="#90CAF9">
            {{ message.message }}
          </v-chip>
          <span>{{ message.author }}</span>
          <v-spacer></v-spacer>
        </template>
        <template v-else>
          <v-chip class="ma-2" label color="#A5D6A7">
            {{ message.message }}
          </v-chip>
          <span>{{ message.author }}</span>
          <v-spacer></v-spacer>
        </template>
      </v-list>
    </div>
  </v-container>
  <v-spacer></v-spacer>
  <v-container fluid>
    <v-footer fixed>
      <v-row>
        <v-col
        cols="12"
        sm="6"
        >
          <v-text-field
          label="message" 
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
            </v-footer>
        <v-btn @click="logout">
          Logout
        </v-btn>
        </v-container>
</div>
</template>

<script>
import firebase from 'firebase'

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
    async saveMessage() {
      //save to firestore
      await db.collection('chat').add({
        message: this.message,
        author: this.authUser.displayName,
        createdAt: new Date()
      })
      .then((docRef) => {
         console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
         console.error("Error adding document: ", error);
      });
      //clean the input msg field
      this.message = null
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
.v-list{
  overflow-y: auto;
}
</style>
