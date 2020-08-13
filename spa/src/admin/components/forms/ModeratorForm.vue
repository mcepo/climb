<template>
  <v-card flat>
    <v-card-title>Adding moderator for {{area.name}}</v-card-title>
    <v-card-text>

      <v-autocomplete
        v-model="selectedUser"
        :items="entries"
        :loading="isLoading"
        :search-input.sync="search"
        item-text="name"
        item-value="id"
        label="Users"
        hide-no-data
        placeholder="Start typing to Search"
        prepend-icon="cloud"
        return-object
      ></v-autocomplete>

      <v-btn text @click='submit()'>Save</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>

import api from '../../../store/api'

export default {
  props: ['area'],
  cancelToken: null,
  data: () => ({
    entries: [],
    isLoading: false,
    selectedUser: null,
    search: null
  }),

  watch: {
    search (newQuery, oldQuery) {
      if (newQuery === oldQuery) return

      this.$options.cancelToken && clearTimeout(this.$options.cancelToken)
      this.$options.cancelToken = setTimeout(() => this.getUsers(newQuery), 500)
    }
  },
  methods: {
    getUsers (query) {
      this.isLoading = true

      api.get('/user/search', { params: { query } })
        .then(({ data }) => {
          this.entries = data
        })
        .finally(() => (this.isLoading = false))
    },
    submit () {
      api.get('/user/' + this.selectedUser.id + '/addArea/' + this.area.id)
        .then(() => {
          this.$store.commit('user/add', this.selectedUser)
          this.$store.commit('area/addModerator', { area: this.area, moderator: this.selectedUser })
          this.selectedUser = null
          this.$store.commit('snackbar/success', this.selectedUser.name + ' added as moderator to' + this.area.name)
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
