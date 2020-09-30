<template>
  <user-list :users='users'></user-list>
</template>

<script>

import UserList from '../components/lists/UserList'

export default {
  computed: {
    users () {
      const userArray = []

      this.$store.state.user.allIds.forEach(id => {
        userArray.push(this.$store.state.user.byIds[id])
      })

      return userArray
    }
  },
  created () {
    this.$store.dispatch('user/fetchAll')
  },
  components: {
    UserList
  }
}
</script>
