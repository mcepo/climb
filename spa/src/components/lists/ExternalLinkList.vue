<template>
<v-card class='pa-2'>
    <v-card-subtitle class='pa-1'>Links with more info</v-card-subtitle>
    <v-card-text class='pa-0'>
        <v-list class='pa-0'>

            <v-list-item
            v-for="link in links"
            :key="link.id"
            class='pl-1'
            >
            <v-list-item-content>
                <v-list-item-title> <a tag='a' target='_blank' :href='link.href'>{{link.name}}</a></v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card-text>
</v-card>
</template>

<script>

export default {
  props: ['links'],
  computed: {
    hasAny () {
      return this.links && this.links.length !== 0
    }
  }
}
</script>
