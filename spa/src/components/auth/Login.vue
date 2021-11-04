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

        <a v-if="statusCode == 422" @click="resendVerificationMail()">
          Resend verification mail
        </a>

        <v-text-field
          v-model="formData.password"
          label="Password"
          prepend-icon="lock"
          type="password"
          :rules="passwordRules"
        />

        <a v-if="statusCode == 400" @click="sendPasswordResetMail()">
          Forgotten password?
        </a>
      </v-card-text>
        <v-card-actions class='ma-4'>
          <v-layout justify-center column>
            <v-btn :disabled="!valid" color="success" @click="submit">
              Login
            </v-btn>
            <v-card-subtitle class="font-weight-light" style='text-align:center'>or</v-card-subtitle>
            <v-btn
              @click="authProvider('google')"
              aria-label="Google login">
                <img  style='height:16px; weight:16px; padding-right:5px' src="/assets/img/icons/google-logo.svg" alt="">
                Google login
              </v-btn>
          </v-layout>
        </v-card-actions>
      <v-card-text
        >Don't have an account yet ...
        <a @click.stop="openForm({ component: 'register-form', params: null })"
          >Sign up</a
        ></v-card-text
      >
    </v-card>
  </v-form>
</template>

<script>
import api from '../../store/api'
import { mapActions } from 'vuex'
import { OAuth2Client } from '@byteowls/capacitor-oauth2'

export default {
  oAuth: {
    google: {
      authorizationBaseUrl: 'https://accounts.google.com/o/oauth2/auth',
      accessTokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
      scope: 'email profile',
      responseType: 'code',
      logsEnabled: true,
      web: {
        appId: process.env.VUE_APP_OAUTH_CLIENT_ID_WEB,
        accessTokenEndpoint: '',
        redirectUrl: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
        windowOptions: 'height=600,left=0,top=0'
      },
      android: {
        appId: process.env.VUE_APP_OAUTH_CLIENT_ID_ANDROID,
        redirectUrl: '<net.climbline:/>'
      }
    }
  },
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

    sendPasswordResetMail () {
      api.post('/forgot_password/', this.formData).then(response => {
        this.$store.dispatch('snackbar/success', response.data)
      })
    },
    resendVerificationMail () {
      api.post('/resend_verification/', this.formData).then(response => {
        this.$store.dispatch('snackbar/success', response.data)
      })
    },
    submit () {
      api
        .post('/login/', this.formData)
        .then(() => {
          this.afterSuccessLogin()
        })
        .catch(error => {
          this.statusCode = error.response?.status
        })
    },

    async authProvider (provider) {
      this.$store.dispatch(
        'snackbar/show',
        'Logging in using ' +
          provider +
          '<br> This may take a couple of seconds ...'
      )

      try {
        const userResponse = await OAuth2Client.authenticate(this.$options.oAuth[provider])

        this.socialLogin(provider, userResponse.authorization_response)
        this.closeForm()
      } catch (error) {
        console.error(error)
      }
    },

    socialLogin (provider, response) {
      api.post('/social_login/' + provider, response).then(() => {
        this.afterSuccessLogin()
      })
    }
  }
}
</script>
