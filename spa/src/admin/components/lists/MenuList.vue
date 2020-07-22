<template>
   <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to='item.to'
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
</template>

<script>

export default {
  data () {
    return {
      items: [
        {
          text: 'Dashboard',
          to: '/admin'
        },
        {
          text: 'Users',
          to: '/admin/users'
        },
        {
          text: 'Images',
          to: '/admin/images'

        },
        {
          text: 'Activity log',
          to: '/admin/activities'

        }
      ]
    }
  }
}
</script>
