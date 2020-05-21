<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
              <span v-if="error">{{ error }}{{ errorCode }}</span>
                <v-form>
                  <v-text-field
                    label="Email"
                    name="email"
                    type="email"
                    v-model="email"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPass ? 'text' : 'password'"
                    class="input-group--focused"
                   @click:append="showPass = !showPass"
                   v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="loginWithEmailAndPassword" color="primary">
                  <span>Login</span>
                </v-btn>
                <v-spacer></v-spacer>
                  <v-btn @click="login" color="primary">
                    <v-icon>mdi-google</v-icon>
                    <span>Login</span>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn @click="signUpPage" color="primary">
                    <span>SignUp</span>
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
    data () {
      return {
        email: null,
        password: null,
        error: null,
        errorCode: null,
        showPass: false,
        password: null,
        rules: {
          required: value => !!value || 'Required.',
         // min: v => v.length >= 8 || 'Min 8 characters',
         // emailMatch: () => ('The email and password you entered don\'t match'),
        },
      }
    },
    props: {
      source: String,
    },
    methods: {
      signUpPage() {
        this.$router.push('/signup')
      },
        loginWithEmailAndPassword() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(data => {
              this.$router.replace('/chat')
            })
            .catch((error) => {
              // Handle Errors here.
              this.errorCode = error.code
              this.error = error.message
              // ...
           });
        },
        login(){
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

            firebase.auth().signInWithPopup(provider).then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            this.$router.push('/chat')

            }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            });   
        }
    }
}
</script>

<style scoped>
.v-content {
  margin-bottom: 330px;
  padding: 0px 0px 0px;
}
</style>>