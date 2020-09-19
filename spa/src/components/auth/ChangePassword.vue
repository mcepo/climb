<template>
  <v-form ref="form" v-model="valid">
    <v-card text color="transparent" flat>
      <v-card-title>
        Password changer!
      </v-card-title>
      <v-card-text>

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
          <v-btn :disabled="!valid" color="success" @click="submit">Update</v-btn>
          <v-btn color="error" @click="close">Cancel</v-btn>
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
      api.post('/change_password/', this.formData)
        .then(() => {
          this.$store.dispatch('form/close')
          this.$store.dispatch('snackbar/success', 'Password succesfully changed')
        })
    }
  }
}
</script>
