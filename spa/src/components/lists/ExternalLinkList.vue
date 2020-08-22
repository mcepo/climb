<template>
  <v-expansion-panels flat v-if='hasAny'>
    <v-expansion-panel>
      <v-expansion-panel-header>External links </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list>

          <v-list-item
            v-for="link in links"
            :key="link.id"
          >
            <v-list-item-content>
              <v-list-item-title> <a tag='a' target='_blank' :href='link.href'>{{link.name}}</a></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>

export default {
  props: ['links'],
  computed: {
    hasAny () {
      return this.links.length !== 0
    }
  }
}
</script>
