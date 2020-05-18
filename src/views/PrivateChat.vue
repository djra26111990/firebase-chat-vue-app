<template>
<v-container fluid>
<h3 class=" text-center">Messaging</h3>
      <div v-for="message in messages" v-bind:key="message.id">
              <template v-if="message.author === authUser.displayName">
                <v-chip class="ma-2" label=true color="#90CAF9">
                  {{ message.message }}
                </v-chip>
                <span>{{ message.author }}</span>
                <v-spacer></v-spacer>
              </template>
              <template v-else>
                <v-chip class="ma-2" label=true color="#A5D6A7">
                  {{ message.message }}
                </v-chip>
                <span>{{ message.author }}</span>
                <v-spacer></v-spacer>
              </template>
            </div>
          <v-spacer></v-spacer>
          <v-footer fixed=true>
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
              fab=true
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
    scrollToBottom(){
      let box = document.querySelector('.msg_history');
        box.scrollTop = box.scrollHeight;
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
        createdAt: new Date()
      }).then(() => {
        this.scrollToBottom();
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
      //clean the input msg field
      this.message = null
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

</style>>
