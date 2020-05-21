<template>
<v-container fluid class="maindiv">
    <div class="div-translucido" id="container" style="max-height: 445px; overflow-x: hidden; overflow-y: auto">
      <div v-for="message in messages" v-bind:key="message.id">
        <template v-if="message.author === authUser.displayName">
        <v-row dense align="center" justify="start">
          <v-col sm="2" xs="2">
          <v-card
            class="animate__animated animate__slideInLeft"
            color="#90CAF9"
            dark
          >
            <v-card-title class="body-2">
              <div>
                {{ message.author }}
              </div>
              <v-col offset="1" class="font-weight-thin">
                {{ message.messageTime }}
              </v-col>
            </v-card-title>

            <v-card-subtitle>{{ message.message }}</v-card-subtitle>
            
          </v-card>
          </v-col>
        </v-row>
        </template>
        <template v-else>
        <v-row dense align="center" justify="space-around">
          <v-col sm="2" xs="2">
          <v-card
            class="animate__animated animate__slideInRight"
            color="white"
          >
            <v-card-title class="body-2">
              <div>
                {{ message.author }}
              </div>
              <v-col offset="1" class="font-weight-thin">
                {{ message.messageTime }}
              </v-col>
            </v-card-title>

            <v-card-subtitle>
              {{ message.message }}
            </v-card-subtitle>
            
          </v-card>
          </v-col>
        </v-row>
        </template>
      </div>
    </div>
    <div>
      <v-row>
        <v-col
        xs="6"
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
        xs="6"
        >
          <v-btn class="mx-2"
          small
          @click="saveMessage"
          fab
          >
          <v-icon>
            mdi-comment-text-outline
          </v-icon>
          </v-btn>
         </v-col>
         <v-col
        xs="2"
        >
          <v-btn class="mx-2"
          small
          @click="logout"
          fab
          >
          <v-icon>
            mdi-power
          </v-icon>
          </v-btn>
         </v-col>
      </v-row>
    </div>
</v-container>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'
import 'animate.css'

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
        createdAt: moment().format('MMMM DD YYYY, HH:mm:ss'),
        messageTime: moment().format('HH:mm')
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

<style scoped>
.maindiv {
  background: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-size: auto auto;
}

.v-btn {
  margin-top: 9px;
}

.v-card {
  max-width: 210px;
  max-height: 90px;
  height: auto;
  width: auto;
}

.div-translucido {
  background-color: rgba(0, 0, 0, 0);
    color:#000;
}

.div-translucido::-webkit-scrollbar {
  width: 1em;
  opacity: 0
}

.div-translucido::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
 
.div-translucido::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.v-card__subtitle, .v-card__text {
  font-size: 0.7rem;
}

.v-application .headline {
  font-size: 0.88rem;
}

@media (max-width: 460px) {
  .v-card {
  max-width: 250px;
  max-height: 110px;
}
}

</style>
