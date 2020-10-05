<template>
  <v-card
    class="ma-2"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">{{user.name}}</v-list-item-title>
        <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
        <v-list-item-subtitle><v-chip :color="user.email_verified_at ? 'green' : 'red'">{{ user.role_id === 1 ? 'Admin': 'User' }}</v-chip></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn text>Button</v-btn>
      <v-btn text>Button</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  computed: {
    user () {
      const id = this.$route.params.id
      return this.$store.state.user.byIds[id]
    }
  }

}
</script>
