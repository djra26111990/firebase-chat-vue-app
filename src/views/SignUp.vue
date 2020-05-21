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
                <v-toolbar-title>SignUp</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
              <span v-if="error">{{ error }}</span>
                <v-form>
                  <v-text-field
                    label="Full Name"
                    name="displayname"
                    type="text"
                    v-model="name"
                  ></v-text-field>
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
                <v-btn @click="signUp" color="primary">
                  <span>SignUp</span>
                </v-btn>
                <v-spacer></v-spacer>
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
        name: null,
        error: null,
        showPass: false,
        password: null,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters'
        },
      }
    },
    props: {
      source: String,
    },
    methods: {
      signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.name
            })
            .then(() => {});
        }).then(
            this.$router.push('/')
        )
        .catch(err => {
          this.error = err.message;
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