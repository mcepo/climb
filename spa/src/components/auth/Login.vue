<template>
  <v-form ref="form" v-model="valid">
    <v-card text color="transparent" flat>

      <v-card-title>Sign in</v-card-title>
      <v-card-text>
        <v-text-field
          label="Email"
          v-model="formData.email"
          prepend-icon="person"
          type="text"
          :rules="emailRules"
        />

        <a v-if='statusCode == 422' @click='resendVerificationMail()'>
          Resend verification mail
        </a>

        <v-text-field
          v-model="formData.password"
          label="Password"
          prepend-icon="lock"
          type="password"
          :rules="passwordRules"
        />

        <a v-if='statusCode == 400' @click='resendVerificationMail()'>
          Forgotten password?
        </a>
      </v-card-text>

      <v-layout justify-center>
        <v-card-actions>
          <v-btn @click="authProvider('google')">Google login</v-btn>
          <v-btn :disabled="!valid" color="success" @click="submit">Login</v-btn>

          <v-btn color="error" @click="closeForm()">Cancel</v-btn>
        </v-card-actions>
      </v-layout>
      <v-card-text>Don't have an account yet ...      <a @click.stop="openForm({component: 'register-form', params: null})">Sign up</a></v-card-text>
    </v-card>
  </v-form>
</template>

<script>

import api from '../../store/api'
import { mapActions } from 'vuex'

export default {
  data: () => ({
    valid: true,
    emailRules: [v => !!v || 'Email is required'],
    passwordRules: [v => !!v || 'Password is required'],
    formData: {},
    statusCode: null
  }),
  methods: {
    ...mapActions({
      openForm: 'form/open',
      closeForm: 'form/close'
    }),

    resendVerificationMail () {
      api.post('/resend_verification/', this.formData)
        .then(response => {
          this.$store.commit('snackbar/success', response.data)
        }).catch((error) => {
          console.log(error.response.status)
          this.statusCode = error.response.status
        })
    },
    submit () {
      api.post('/login/', this.formData)
        .then(response => {
          this.$store.dispatch('auth/login', response.data)
          this.closeForm()
        }).catch((error) => {
          console.log(error.response.status)
          this.statusCode = error.response.status
        })
    },
    authProvider (provider) {
      this.$auth
        .authenticate(provider)
        .then(response => {
          this.socialLogin(provider, response)
        })
    },
    socialLogin (provider, response) {
      api.post('/social_login/' + provider, response)
        .then(response => {
          this.$store.dispatch('auth/login', response.data)
          this.closeForm()
        })
    }
  }
}
</script>
