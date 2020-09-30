<template>
  <v-data-table
    :headers="headers"
    :items="users"
    @click:row="openUserDetails"
  >
    <template v-slot:item.email_verified_at="{ item }">
      <v-chip :color="item.email_verified_at ? 'green' : 'red'"><i>{{ item.email_verified_at !== null ? 'Verified': 'Not verified' }}</i></v-chip>
    </template>
    <template v-slot:item.role_id="{ item }">
      <v-chip>{{ item.role_id === 1 ? 'Admin': 'User' }}</v-chip>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Email verification', value: 'email_verified_at' },
        { text: 'Role', value: 'role_id' }
      ]
    }
  },
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
  methods: {
    openUserDetails (user) {
      this.$router.push('/admin/user/' + user.id)
    }
  }
}
</script>
