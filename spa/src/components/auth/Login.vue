<template>
  <v-form ref="form" v-model="valid">
    <v-card text color="transparent">
      <v-card-text>
        <v-text-field
          label="Email"
          v-model="formData.email"
          prepend-icon="person"
          type="text"
          :rules="emailRules"
        />

        <v-text-field
          v-model="formData.password"
          label="Password"
          prepend-icon="lock"
          type="password"
          :rules="passwordRules"
        />
      </v-card-text>

      <v-btn @click="authProvider('google')">Google login</v-btn> or
      <v-btn @click.stop="openForm({component: 'register-form', params: null})">Sign up</v-btn>

      <v-layout justify-center>
        <v-card-actions>
          <v-btn :disabled="!valid" color="success" @click="submit">Login</v-btn>

          <v-btn color="error" @click="closeForm()">Cancel</v-btn>
        </v-card-actions>
      </v-layout>
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
    formData: {}
  }),
  methods: {
    ...mapActions({
      openForm: 'form/open',
      closeForm: 'form/close'
    }),
    submit () {
      api.post('/login/', this.formData)
        .then(response => {
          this.$store.dispatch('auth/login', response.data)
          this.closeForm()
        })
        .catch(err => {
          console.log({ err: err })
        })
    },
    authProvider (provider) {
      this.$auth
        .authenticate(provider)
        .then(response => {
          this.socialLogin(provider, response)
        })
        .catch(err => {
          console.log({ err: err })
        })
    },
    socialLogin (provider, response) {
      api.post('/social_login/' + provider, response)
        .then(response => {
          this.$store.dispatch('auth/login', response.data)
          this.closeForm()
        })
        .catch(err => {
          console.log({ err: err })
        })
    }
  }
}
</script>
