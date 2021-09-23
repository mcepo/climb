<template>
  <v-form ref="form" v-model="valid">
    <v-card-title>Registration</v-card-title>
    <v-card text color="transparent" flat>
      <v-card-text>
        <v-text-field
          label="Name"
          v-model="formData.name"
          prepend-icon="person"
          type="text"
          :rules="nameRules"
        />
        <v-text-field
          label="Email"
          v-model="formData.email"
          prepend-icon="email"
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

        <v-text-field
          v-model="formData.passwordConfirm"
          label="Confirm password"
          prepend-icon="lock"
          type="password"
          :rules="passwordRules"
        />
      </v-card-text>

      <v-layout justify-center>
        <v-card-actions>
          <v-btn
            aria-label='Register'
            :disabled="!valid"
            color="success"
            @click="submit">
              Register
          </v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-form>
</template>

<script>

import api from '../../store/api'

export default {
  data: () => ({
    valid: true,
    emailRules: [v => !!v || 'Email is required'],
    nameRules: [v => !!v || 'Name is required'],
    formData: {}
  }),
  computed: {
    passwordRules () {
      return [v => !!v || 'Password is required', this.passwordConfirmationRule()]
    },
    passwordConfirmationRule () {
      return () => (!this.formData.passwordConfirm || this.formData.password === this.formData.passwordConfirm) || 'Passwords must match'
    }
  },
  methods: {
    close () {
      this.$store.dispatch('form/close')
    },
    submit () {
      api.post('/register/', this.formData)
        .then(() => {
          this.$store.dispatch('form/close')
          this.$store.dispatch('snackbar/show', 'A link was send to your email account.<br>Please verify your email by <br> following the link.')
        })
    }
  }
}
</script>
